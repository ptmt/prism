using Owin;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prism.App
{
    public static class LoggerExtensions
    {
        /// <summary>
        /// Enables default file serving on the current path from the current directory
        /// </summary>
        /// <param name="builder"></param>
        /// <returns></returns>
        public static IAppBuilder UseLogger(this IAppBuilder builder)
        {
            return builder.Use(typeof(LoggerMiddleware));
        }
    }

    
    public class LoggerMiddleware
    {
        private readonly Func<IDictionary<string, object>, Task> _next;


        public LoggerMiddleware(Func<IDictionary<string, object>, Task> next)
        {
            _next = next;
        }

        public Task Invoke(IDictionary<string, object> env)
        {
            string method = GetValueFromEnvironment(env, OwinConstants.RequestMethod);
            string path = GetValueFromEnvironment(env, OwinConstants.RequestPath);

            Console.WriteLine("Entry\t{0}\t{1}", method, path);

            Stopwatch stopWatch = Stopwatch.StartNew();
            return _next(env).ContinueWith(t =>
            {
                Console.WriteLine("Exit\t{0}\t{1}\t{2}ms\t{3}\t{4}", method, path, stopWatch.ElapsedMilliseconds,
                  GetValueFromEnvironment(env, OwinConstants.ResponseStatusCode),
                  GetValueFromEnvironment(env, OwinConstants.ResponseReasonPhrase));
                return t;
            });
        }

        private static string GetValueFromEnvironment(IDictionary<string, object> environment, string key)
        {
            object value;
            environment.TryGetValue(key, out value);
            return Convert.ToString(value, CultureInfo.InvariantCulture);
        }
    }
}
