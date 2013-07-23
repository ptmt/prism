module Prism.App.Configuration

open Owin
open System.Web.Http

type public Startup()  = class
    member public x.Configuration (app:IAppBuilder) =       
       
        app.UseHandlerAsync (StartupExtensions.OwinHandlerAsync(
                                    fun req res -> res.WriteAsync("Hello, world!")
        )) |> ignore        
      
end
