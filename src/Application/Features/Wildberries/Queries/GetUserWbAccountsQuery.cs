using MediatR;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Wildberries.DTOs;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.Application.Features.Wildberries.Queries;

public sealed record GetUserWbAccountsQuery(Guid UserId) : IRequest<Result<IReadOnlyList<WbAccountDto>>>;

internal sealed class GetUserWbAccountsQueryHandler : IRequestHandler<GetUserWbAccountsQuery, Result<IReadOnlyList<WbAccountDto>>>
{
    private readonly IWbAccountRepository _accountRepository;
    private readonly IUserRepository _userRepository;

    public GetUserWbAccountsQueryHandler(
        IWbAccountRepository accountRepository,
        IUserRepository userRepository)
    {
        _accountRepository = accountRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<IReadOnlyList<WbAccountDto>>> Handle(GetUserWbAccountsQuery request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, ct);
        if (user is null)
            return Result.Failure<IReadOnlyList<WbAccountDto>>("Пользователь не найден");

        var accounts = await _accountRepository.GetByUserIdAsync(request.UserId, ct);

        var dtos = accounts
            .Select(a => new WbAccountDto(
                a.Id,
                a.ShopName,
                a.Status,
                a.LastSyncAt,
                a.CreatedAt,
                a.ErrorMessage))
            .ToList();

        return dtos;
    }
}
