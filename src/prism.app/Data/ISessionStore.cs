using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App.Data
{
    interface ISessionStore
    {
        void Add(string key, object value);        
        Task<object> Get(string key);
        Task<bool> Update(string userName, string newSecret);
        object this[string name] { get; set; }
    }
}
