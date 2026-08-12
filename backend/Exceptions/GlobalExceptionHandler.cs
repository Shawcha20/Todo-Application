namespace backend.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
public class GlobalExceptionHandler: IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, Exception exception,
        CancellationToken cancellationToken
    )
    {
        httpContext.Response.StatusCode=StatusCodes.Status500InternalServerError;
        httpContext.Response.ContentType= "application/json";

        await httpContext.Response.WriteAsJsonAsync(
            new
            {
                message= "An unexpected error occured"
            },
            cancellationToken
        );
        return true;
    }
}