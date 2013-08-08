﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Caching;
using Nancy; 

namespace Prism.App.Data
{
    public class InMemorySessionStore : ISessionStore
    {
        private string sessionId;
        private ObjectCache cache;

        public InMemorySessionStore (Request httpReq)
	    {
            sessionId = httpReq.Cookies[SessionIdHandler.SessionIdToken].ToString();
            //sessionId = httpReq.Properties[SessionIdHandler.SessionIdToken].ToString();
            cache = MemoryCache.Default;
	    }
        public void Add(string key, object value)
        {
            cache.Add(key, value, DateTime.Now.AddDays(30));            
        }

        public Task<object> GetAsync(string key)
        {
            return Task.Run<object>(() =>
            {
                return cache.Get(key);
            });          
        }

        public Task<bool> UpdateAsync(string userName, string newSecret)
        {
            throw new NotImplementedException();
        }

        public void Remove(string key)
        {
            cache.Remove(key);
        }
        public object this[string key]
        {
            get
            {
                return this.GetAsync(key).Result;
            }
            set
            {
                Add(key, value);
            }
        }
    }
}
