module Prism.App.Configuration

open Owin
open System.Web.Http
//open Microsoft.Owin.StaticFiles

type public Startup()  = class
    member public x.Configuration (app:IAppBuilder) =       
               

        app.UseErrorPage().UseFileServer("/", "/public") |> ignore
        
      
end
