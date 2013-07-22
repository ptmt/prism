module prism.server

open System
open Microsoft.Owin.Hosting

[<EntryPoint>]
let main argv = 
    let baseAddress = "http://localhost:8888";   

    use a =  Microsoft.Owin.Hosting.WebApp.Start<Startup.Startup>(baseAddress)
    Console.WriteLine("Server running on {0}", baseAddress)
    Console.ReadLine() |> ignore    
    0 
