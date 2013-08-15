using Nancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App
{
    public class DefaultModule : NancyModule
    {
        public DefaultModule()
        {
            /// For development server, where nginx is not installed
            /// And Nancy could not route to index.html
            /// 
            Get["/"] = _ =>
            {               
                return Response.AsRedirect("/index.html");                
            };     
        }
    }
}
