Set html = CreateObject("htmlfile")
html.write "<script>window.onerror=function(m,u,l){WScript.Echo('Err: '+m+' at line '+l);};</script>"
html.write CreateObject("Scripting.FileSystemObject").OpenTextFile("c:\Users\38581182810\Documents\GitHub\RogueBomb\RogueBomb\index.html").ReadAll()
WScript.Sleep 1000
