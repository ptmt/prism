using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Data
{
    public interface IUserSecretStore
    {
        Task<bool> Create(IUserSecret userSecret);
        Task<bool> Delete(string userName);
        Task<IUserSecret> Find(string userName);
        Task<bool> UpdateSecret(string userName, string newSecret);
        Task<bool> Validate(string userName, string loginSecret);
    }

    public interface IUserLoginStore
    {
        Task<bool> Add(IUserLogin login);
        Task<System.Collections.Generic.IList<IUserLogin>> GetLogins(string userId);
        Task<string> GetProviderKey(string userId, string loginProvider);
        Task<string> GetUserId(string loginProvider, string providerKey);
        Task<bool> Remove(string userId, string loginProvider, string providerKey);
    }

    public interface IUserStore
    {
        Task<bool> Create(IUser user);
        Task<bool> Delete(string userId);
        Task<IUser> Find(string userId);
    }

    public interface IUser
    {
        string Id { get; set; }
    }

    public interface IUserSecret
    {
        string Secret { get; set; }
        string UserName { get; set; }
    }

    public interface IUserLogin
    {
        string LoginProvider { get; set; }
        string ProviderKey { get; set; }
        string UserId { get; set; }
    }
}
