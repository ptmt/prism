using Prism.App.Modules;
using Prism.App.Data;
using System;
using Xunit;
using Newtonsoft.Json.Linq;


namespace prism.tests
{
   
    public class FoursquareProcessingTests
    {
        

        [Fact]
        public void MockDataFileShouldExist()
        {
            
            string filename = ApiModule.GetCheckinsFilename();
            
            Assert.True(System.IO.File.Exists(filename));
        }

        [Fact]
        public void ParseMockDataShouldReturnCheckinsArrayFromSessionStore()
        {
            ISessionStore sessionStore = new InMemorySessionStore();
            ApiModule.ParseMockCheckinsIntoMemory(sessionStore);

            JArray checkins = (JArray)sessionStore["checkins"];
            Assert.True(checkins.Count > 0);
        }
    }
}
