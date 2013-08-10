using Prism.App.Modules;
using Prism.App.Data;
using System;
using Xunit;
using Newtonsoft.Json.Linq;
using Prism.App.Models;


namespace prism.tests
{
   
    public class FoursquareProcessingTests
    {
        const int MockFileId = 1;

        [Fact]
        public void Mock_checkins1_file_should_exist()
        {

            string filename = ApiModule.GetCheckinsFilename(MockFileId);
            
            Assert.True(System.IO.File.Exists(filename));
        }

        [Fact]
        public void Parse_mockdata_should_return_foursquare_response_contains_checkins()
        {
            ISessionStore sessionStore = new InMemorySessionStore();
            ApiModule.ParseMockCheckinsIntoMemory(sessionStore, MockFileId);

            Assert.True(((FoursquareResponseData)sessionStore["checkins"]).Checkins.Count > 0);
        }
    }
}
