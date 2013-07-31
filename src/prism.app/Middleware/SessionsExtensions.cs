using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App
{

    public static class SessionsExtensions
    {
        /// <summary>
        /// Enables default file serving on the current path from the current directory
        /// </summary>
        /// <param name="builder"></param>
        /// <returns></returns>
        public static IAppBuilder UseSessions(this IAppBuilder builder)
        {
            return builder.Use(typeof(SessionsMiddleware));
        }
    }
}
