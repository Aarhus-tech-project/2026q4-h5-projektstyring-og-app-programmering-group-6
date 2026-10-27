using LoebeApp.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using System.ComponentModel.DataAnnotations;
using Npgsql;
using System.Net.Sockets;

namespace LoebeApp.ErrorHandling
{
    public class ApiExceptionHandler(
        ILogger<ApiExceptionHandler> logger) : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            var statusCode = exception switch
            {
                EmailAlreadyInUseException => StatusCodes.Status409Conflict,
                InvalidCredentialsException => StatusCodes.Status401Unauthorized,
                ValidationException => StatusCodes.Status400BadRequest,
                _ when IsDatabaseConnectionFailure(exception)
                    => StatusCodes.Status503ServiceUnavailable,
                _ => StatusCodes.Status500InternalServerError
            };

            if (statusCode is StatusCodes.Status500InternalServerError
                or StatusCodes.Status503ServiceUnavailable)
            {
                logger.LogError(
                    exception,
                    "Der opstod en uventet fejl under {Method} {Path}",
                    httpContext.Request.Method,
                    httpContext.Request.Path);
            }

            var detail = statusCode switch
            {
                StatusCodes.Status503ServiceUnavailable
                    => "Der kunne ikke oprettes forbindelse til databasen.",
                StatusCodes.Status500InternalServerError
                    => "Der opstod en intern serverfejl.",
                _ => exception.Message
            };

            await Results.Problem(
                statusCode: statusCode,
                detail: detail
            ).ExecuteAsync(httpContext);

            return true;
        }

        private static bool IsDatabaseConnectionFailure(Exception exception)
        {
            for (Exception? current = exception;
                 current is not null;
                 current = current.InnerException)
            {
                if (current is NpgsqlException { InnerException: SocketException })
                {
                    return true;
                }
            }

            return false;
        }
    }
}