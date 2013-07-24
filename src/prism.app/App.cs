﻿using Owin;
using Microsoft.Owin.Security.Forms;
using Microsoft.Owin.Security.OAuth;

namespace Prism.App
{
    public class Startup
    {        
        public void Configuration(IAppBuilder app)
        {                      
            app.UseFileServer(options =>
            {
                options.WithRequestPath("/");
                options.WithPhysicalPath("../src/assets");               
            });

            app.UseDiagnosticsPage();

            app.CreateLogger("some");

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerAuthentication(Config.IdentityConfig.Bearer);

            // Enable the application to use a cookie to store information for the signed in user
            app.UseFormsAuthentication(new FormsAuthenticationOptions
            {
                AuthenticationType = Config.IdentityConfig.CookieAuthenticationType,
                LoginPath = "/"
            });

            // Enable the application to use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie();
            
        }
    }


}
