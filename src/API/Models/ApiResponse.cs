namespace MessagingPlatform.API.Models;

public sealed class ApiResponse<T>
{
    public bool IsSuccess { get; init; }
    public T? Data { get; init; }
    public List<ApiError> Errors { get; init; } = [];

    public static ApiResponse<T> Success(T data) => new()
    {
        IsSuccess = true,
        Data = data
    };

    public static ApiResponse<T> Failure(string error) => new()
    {
        IsSuccess = false,
        Errors = [new ApiError(error)]
    };

    public static ApiResponse<T> Failure(IEnumerable<string> errors) => new()
    {
        IsSuccess = false,
        Errors = errors.Select(e => new ApiError(e)).ToList()
    };
}

public sealed class ApiResponse
{
    public bool IsSuccess { get; init; }
    public List<ApiError> Errors { get; init; } = [];

    public static ApiResponse Success() => new() { IsSuccess = true };

    public static ApiResponse Failure(string error) => new()
    {
        IsSuccess = false,
        Errors = [new ApiError(error)]
    };
}

public sealed record ApiError(string Description);
