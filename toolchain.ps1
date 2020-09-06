Remove-Item "C:\Users\maste\urpr-flask\static" -Confirm:$false -Recurse;
Copy-Item -Path ".\build" -Destination "C:\Users\maste\urpr-flask" -Recurse -Confirm:$false;
Rename-Item -Path "C:\Users\maste\urpr-flask\build" -NewName "static" -Confirm:$false