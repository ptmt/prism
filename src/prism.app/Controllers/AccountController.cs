using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Routing;
//using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;


namespace WebApplication1.Controllers
{
    [Authorize]
    public class AjaxAccountController : ApiController
    {
        public AjaxAccountController() : this(IdentityConfig.Secrets, IdentityConfig.Logins, IdentityConfig.Users, IdentityConfig.Bearer, IdentityConfig.ExternalIdentityHandler) { }

        public AjaxAccountController(IUserSecretStore secrets, IUserLoginStore logins, IUserStore users, OAuthBearerAuthenticationOptions bearer, ISecureDataHandler<ClaimsIdentity> externalIdentityHandler)
        {
            Secrets = secrets;
            Logins = logins;
            Users = users;          
            Bearer = bearer;
            ExternalIdentityHandler = externalIdentityHandler;
        }

        public IUserSecretStore Secrets { get; private set; }
        public IUserLoginStore Logins { get; private set; }
        public IUserStore Users { get; private set; }      
        public OAuthBearerAuthenticationOptions Bearer { get; private set; }
        public ISecureDataHandler<ClaimsIdentity> ExternalIdentityHandler { get; private set; }

        //[HttpGet]
        //public UserInfo UserInfo()
        //{
        //    return new UserInfo
        //    {
        //        UserName = User.Identity.GetUserName()
        //    };
        //}
                

        [AllowAnonymous]
        [HttpGet]
        public IHttpActionResult ExternalLogin(string provider, string returnUrl)
        {
            return Challenge(provider, returnUrl);
        }

        [AllowAnonymous]
        [HttpGet("api/AjaxAccount/ExternalLoginRedirect", RouteName = "ExternalLoginRedirect")]
        public async Task<IHttpActionResult> ExternalLoginRedirect()
        {
            ClaimsIdentity identity = await GetExternalIdentity();

            if (identity == null)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            string state = ExternalIdentityHandler.Protect(identity);
            return RedirectToRoute("ExternalLoginCallback", new { state = state });
        }

    //    [AllowAnonymous]
    //    [HttpGet("api/AjaxAccount/ExternalLogins")]
    //    public IEnumerable<ExternalLogin> ExternalLogins()
    //    {
    //        IEnumerable<AuthenticationDescription> descriptions = GetExternalAuthenticationTypes();
    //        List<ExternalLogin> logins = new List<ExternalLogin>();

    //        foreach (AuthenticationDescription description in descriptions)
    //        {
    //            ExternalLogin login = new ExternalLogin
    //            {
    //                Name = description.Caption,
    //                Url = Url.Route("ExternalLogin", new
    //                {
    //                    provider = description.AuthenticationType,
    //                    returnUrl = Url.Route("ExternalLoginRedirect", null)
    //                })
    //            };
    //            logins.Add(login);
    //        }

    //        return logins;
    //    }

    //    [AllowAnonymous]
    //    [HttpGet("api/AjaxAccount/ExternalLoginCallback", RouteName = "ExternalLoginCallback")]
    //    public async Task<object> ExternalLoginCallback(string state)
    //    {
    //        ClaimsIdentity externalIdentity = ExternalIdentityHandler.Unprotect(state);

    //        if (externalIdentity == null)
    //        {
    //            ModelState.AddModelError(String.Empty, "External login failure.");
    //            return new AjaxFailure
    //            {
    //                Errors = GetErrorsFromModelState()
    //            };
    //        }

    //        // Succeeded so we should be able to lookup the local user name and sign them in
    //        string providerKey = externalIdentity.FindFirstValue(ClaimTypes.NameIdentifier);
    //        string userId = await Logins.GetUserId(externalIdentity.AuthenticationType, providerKey);
    //        if (String.IsNullOrEmpty(userId))
    //        {
    //            return new RegisterExternalLogin
    //            {
    //                UserName = externalIdentity.Name,
    //                LoginProvider = externalIdentity.AuthenticationType
    //            };
    //        }

    //        IEnumerable<Claim> claims = await FindClaims(userId, externalIdentity.Claims);
    //        ClaimsIdentity cookieIdentity = CreateCookieIdentity(claims);
    //        Grant(cookieIdentity, isPersistent: false);
    //        User user = (User)await Users.Find(userId);
    //        return new UserInfo
    //        {
    //            UserName = user.UserName,
    //            AccessToken = CreateAccessToken(CreateBearerIdentity(claims))
    //        };
    //    }

    //    [HttpPost("api/AjaxAccount/LogOff")]
    //    public AjaxSuccess LogOff()
    //    {
    //        HttpContext.Current.SignOut();

    //        return new AjaxSuccess
    //        {
    //            Success = true
    //        };
    //    }

    //    [AllowAnonymous]
    //    [HttpPost("api/AjaxAccount/Register")]
    //    public async Task<object> Register(RegisterViewModel model)
    //    {
    //        if (ModelState.IsValid)
    //        {
    //            string userName = model.UserName;
    //            if (await Secrets.Find(userName) != null)
    //            {
    //                ModelState.AddModelError(String.Empty, "User already exists: " + userName);
    //                return new AjaxFailure
    //                {
    //                    Errors = GetErrorsFromModelState()
    //                };
    //            }

    //            try
    //            {
    //                // Create a profile, password, and link the local account before signing in the user
    //                User user = new User(model.UserName);
    //                if (await Users.Create(user) &&
    //                    await Secrets.Create(new UserSecret(model.UserName, model.Password)) &&
    //                    await Logins.Add(new UserLogin(user.Id, IdentityConfig.LocalLoginProvider, model.UserName)))
    //                {
    //                    IEnumerable<Claim> claims = await FindClaims(user.Id, new Claim[0]);
    //                    ClaimsIdentity cookieIdentity = CreateCookieIdentity(claims);
    //                    Grant(cookieIdentity, isPersistent: false);
    //                    InitiateDatabaseForNewUser(user.Id);

    //                    return new UserInfo
    //                    {
    //                        UserName = model.UserName,
    //                        AccessToken = CreateAccessToken(CreateBearerIdentity(claims))
    //                    };
    //                }
    //                else
    //                {
    //                    ModelState.AddModelError(String.Empty, "Failed to create login for: " + model.UserName);
    //                }
    //            }
    //            catch (DbEntityValidationException e)
    //            {
    //                ModelState.AddModelError(String.Empty, e.EntityValidationErrors.First().ValidationErrors.First().ErrorMessage);
    //            }
    //        }

    //        // If we got this far, something failed
    //        return new AjaxFailure
    //        {
    //            Errors = GetErrorsFromModelState()
    //        };
    //    }

    //    [AllowAnonymous]
    //    [HttpPost("api/AjaxAccount/RegisterExternal")]
    //    public async Task<object> RegisterExternal(RegisterExternalViewModel model)
    //    {
    //        if (ModelState.IsValid)
    //        {
    //            ClaimsIdentity externalIdentity = ExternalIdentityHandler.Unprotect(model.State);
    //            if (externalIdentity == null)
    //            {
    //                ModelState.AddModelError(String.Empty, "External login failure.");
    //                return new AjaxFailure
    //                {
    //                    Errors = GetErrorsFromModelState()
    //                };
    //            }

    //            string userName = model.UserName;
    //            if (await Secrets.Find(userName) != null)
    //            {
    //                ModelState.AddModelError(String.Empty, "User already exists: " + userName);
    //                return new AjaxFailure
    //                {
    //                    Errors = GetErrorsFromModelState()
    //                };
    //            }

    //            try
    //            {
    //                // Create a profile and link the local account before signing in the user
    //                string providerKey = externalIdentity.FindFirstValue(ClaimTypes.NameIdentifier);
    //                User user = new User(model.UserName);
    //                if (await Users.Create(user) &&
    //                    await Logins.Add(new UserLogin(user.Id, externalIdentity.AuthenticationType, providerKey)))
    //                {
    //                    IEnumerable<Claim> claims = await FindClaims(user.Id, new Claim[0]);
    //                    ClaimsIdentity cookieIdentity = CreateCookieIdentity(claims);
    //                    Grant(cookieIdentity, isPersistent: false);
    //                    InitiateDatabaseForNewUser(user.Id);

    //                    return new UserInfo
    //                    {
    //                        UserName = model.UserName,
    //                        AccessToken = CreateAccessToken(CreateBearerIdentity(claims))
    //                    };
    //                }
    //                else
    //                {
    //                    ModelState.AddModelError(String.Empty, "Failed to create login for: " + model.UserName);
    //                }
    //            }
    //            catch (DbEntityValidationException e)
    //            {
    //                ModelState.AddModelError(String.Empty, e.EntityValidationErrors.First().ValidationErrors.First().ErrorMessage);
    //            }
    //        }

    //        // If we got this far, something failed
    //        return new AjaxFailure
    //        {
    //            Errors = GetErrorsFromModelState()
    //        };
    //    }

    //    /// <summary>
    //    /// Initiate a new todo list for new user
    //    /// </summary>
    //    /// <param name="userName"></param>
    //    internal static void InitiateDatabaseForNewUser(string userName)
    //    {
    //        using (TodoItemContext db = new TodoItemContext())
    //        {
    //            TodoList todoList = new TodoList();
    //            todoList.UserId = userName;
    //            todoList.Title = "My Todo List #1";
    //            todoList.Todos = new List<TodoItem>();
    //            db.TodoLists.Add(todoList);
    //            db.SaveChanges();

    //            todoList.Todos.Add(new TodoItem() { Title = "Todo item #1", TodoListId = todoList.TodoListId, IsDone = false });
    //            todoList.Todos.Add(new TodoItem() { Title = "Todo item #2", TodoListId = todoList.TodoListId, IsDone = false });
    //            db.SaveChanges();
    //        }
    //    }

        private IHttpActionResult Challenge(string loginProvider, string returnUrl)
        {
            return new ChallengeResult(loginProvider, returnUrl, Request);
        }

    //    private string CreateAccessToken(ClaimsIdentity identity)
    //    {
    //        return Bearer.AccessTokenHandler.Protect(new AuthenticationTicket(identity, new AuthenticationExtra()));
    //    }

    //    private ClaimsIdentity CreateBearerIdentity(IEnumerable<Claim> claims)
    //    {
    //        return IdentityConfig.CreateBearerIdentity(claims);
    //    }

    //    private ClaimsIdentity CreateCookieIdentity(IEnumerable<Claim> claims)
    //    {
    //        return IdentityConfig.CreateCookieIdentity(claims);
    //    }

    //    private Task<IEnumerable<Claim>> FindClaims(string userId, IEnumerable<Claim> providerClaims)
    //    {
    //        return IdentityConfig.FindClaims(Users, Roles, userId, providerClaims);
    //    }

    //    private IEnumerable<string> GetErrorsFromModelState()
    //    {
    //        return ModelState.SelectMany(x => x.Value.Errors.Select(error => error.ErrorMessage));
    //    }

    //    private IEnumerable<AuthenticationDescription> GetExternalAuthenticationTypes()
    //    {
    //        return HttpContext.Current.GetExternalAuthenticationTypes();
    //    }

    //    private Task<ClaimsIdentity> GetExternalIdentity()
    //    {
    //        return IdentityConfig.GetExternalIdentity(new HttpContextWrapper(HttpContext.Current));
    //    }

    //    private void Grant(ClaimsIdentity identity, bool isPersistent)
    //    {
    //        Request.GetOwinResponse().Grant(identity, new AuthenticationExtra
    //        {
    //            IsPersistent = isPersistent
    //        });
    //    }

    //    private IHttpActionResult RedirectToRoute(string routeName, object routeValues)
    //    {
    //        return new RedirectToRouteResult(routeName, routeValues, Url, Request);
    //    }

        private class ChallengeResult : IHttpActionResult
        {
            public ChallengeResult(string loginProvider, string returnUrl, HttpRequestMessage request)
            {
                LoginProvider = loginProvider;
                ReturnUrl = returnUrl;
                Request = request;
            }

            public string LoginProvider { get; set; }
            public string ReturnUrl { get; set; }
            public HttpRequestMessage Request { get; set; }

            public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
            {
                Request.GetOwinResponse().Challenge(new string[] { LoginProvider }, new AuthenticationExtra
                {
                    RedirectUrl = ReturnUrl
                });

                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                response.RequestMessage = Request;
                return Task.FromResult(response);
            }
        }

    //    private class RedirectToRouteResult : IHttpActionResult
    //    {
    //        public RedirectToRouteResult(string routeName, object routeValues, UrlHelper urlHelper, HttpRequestMessage request)
    //        {
    //            RouteName = routeName;
    //            RouteValues = routeValues;
    //            Url = urlHelper;
    //            Request = request;
    //        }

    //        public string RouteName { get; set; }
    //        public object RouteValues { get; set; }
    //        public UrlHelper Url { get; set; }
    //        public HttpRequestMessage Request { get; set; }

    //        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
    //        {
    //            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.Redirect);
    //            response.Headers.Location = new Uri(Url.Link(RouteName, RouteValues));
    //            response.RequestMessage = Request;
    //            return Task.FromResult(response);
    //        }
    //    }
    //}
}