//#r "tools\FAKE\FakeLib.dll"
#r "tools/FAKE/FakeLib.dll"


// include Fake libs

open Fake
open System


// Properties
let separatorPath = System.IO.Path.DirectorySeparatorChar.ToString()
let baseDir = System.IO.Directory.GetCurrentDirectory() //@"D:\projects\totify"
let buildDir = baseDir + separatorPath + "build" + separatorPath
let sourcesDir = baseDir + "src" + separatorPath
let appReferences = !+ (baseDir + @"/**/*.fsproj") 


// Targets
Target "Clean" (fun _ ->
    CleanDir buildDir
    CreateDir sourcesDir
)

Target "Initlog" (fun _ -> 
    printfn "Current directory: %A" (System.IO.Directory.GetCurrentDirectory())
    
)


Target "Scan" (fun _ -> 
    appReferences |> Scan |> Seq.iter (printfn "scanned %s")
)

Target "BuildApp" (fun _ ->
    appReferences
        |> Scan 
        |> MSBuildRelease buildDir "Build" 
        |> Log "AppBuild-Output: "
)
// Dependencies
"Clean"
    ==> "Initlog"  
    ==> "Scan"
    ==> "BuildApp" 

|> printfn "%A"      

// start build
Run "BuildApp"