using Nancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Modules
{
    public class AccountModule : NancyModule
    {
        public AccountModule()
        {
            Get["/moo"] = x => "moo";
        }
    }
}
