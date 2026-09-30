try {
  var fso = new ActiveXObject('Scripting.FileSystemObject');
  var file = fso.OpenTextFile('c:\\Users\\38581182810\\Documents\\GitHub\\RogueBomb\\RogueBomb\\index.html', 1);
  var content = file.ReadAll();
  file.Close();
  // Strip out HTML tags to just leave JS? Or just find the script tag.
  var scriptRegex = /<script>([\s\S]*?)<\/script>/;
  var match = scriptRegex.exec(content);
  if (match) {
     var jsCode = match[1];
     try {
       new Function(jsCode);
       WScript.Echo('Syntax OK');
     } catch(e) {
       WScript.Echo('Syntax Error: ' + e.message);
     }
  } else {
     WScript.Echo('No script tag found');
  }
} catch(e) {
  WScript.Echo('Error reading file: ' + e.message);
}
