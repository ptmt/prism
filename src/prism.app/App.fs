module Prism.App.Configuration

open Owin
open System.Web.Http
//open Microsoft.Owin.StaticFiles

type public Startup()  = class
    member public x.Configuration (app:IAppBuilder) =       
       
        app.UseHandlerAsync (StartupExtensions.OwinHandlerAsync(
                                    fun req res -> res.WriteAsync("Hello, world!")
        )) |> ignore        


//        // Allow directory browsing from a specific dir.
//        builder.UseFileServer(options =>
//        {
//            options.WithRequestPath("/browse");
//            options.WithPhysicalPath("public");
//            options.WithDirectoryBrowsing();
//        });
      
end
