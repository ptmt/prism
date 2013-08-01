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
        Task<object> GetAsync(string key);
        Task<bool> UpdateAsync(string key, string value);
        object this[string name] { get; set; }
        void Remove(string key);
    }
}
