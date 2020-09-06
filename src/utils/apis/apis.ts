import { stringify } from "querystring";
import { IMergedPersonaCustomedProps } from "../../interfaces/IPersonas";
import { IPageManifest } from "../../interfaces/IPageManifest";
import { IOpendataItem } from "../../interfaces/IOpendata";

export const uploadPersonaUrl = "/console/api-upload-personas/";
export function uploadPersona(_file: File, _callback: () => void) {
    try {
        var form = new FormData();
        form.append("file", _file);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", uploadPersonaUrl, true);
        xhr.send(form)
        xhr.onload = function () {
            _callback()
            // if (xhr.readyState == 4 && xhr.status == 200) {
            //     alert("upload success")
            // } else if (xhr.readyState == 4) {
            //     alert("upload failed")
            //     return;
            // };
        };
    } catch{

    }
}

export const uploadManifestUrl = "/console/api-update-manifest/";
export function uploadManifest(manifestName: "personas" | "opendata" | "pages", jsonObject: Object, _callback: () => void = () => { }) {
    try {
        var form = new FormData();
        var xhr = new XMLHttpRequest();
        xhr.open("POST", uploadManifestUrl + manifestName, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(jsonObject))
        xhr.onload = function () { if (xhr.readyState == 4 && xhr.status == 200) _callback(); else alert("Error") };
    } catch (e) {
        console.log(e)
    }
}

export function uploadPersonasManifest(personas: IMergedPersonaCustomedProps[]) {
    uploadManifest("personas", personas, () => { })
}

export function uploadPagesManifest(pages: IPageManifest[]) {
    uploadManifest("pages", pages, () => { })
}

export function uploadOpenDataManifest(opendata: IOpendataItem[]) {
    uploadManifest("opendata", opendata, () => { })
}



export function uploadPageThumbnail(fileObject: File,
    _successCallback: () => void = () => { },
    _failCallback: () => void = () => { }
) {
    try {
        var form = new FormData();
        form.append("file", fileObject);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/console/api-upload-image/", true);
        xhr.send(form)
        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                _successCallback();
                return;
            } else if (xhr.readyState == 4) {
                _failCallback();
                return;
            };
        };
    } catch{

    }
}

export function uploadPageResources(fileObject: File,
    pageRoute: string,
    _successCallback: () => void = () => { },
    _failCallback: () => void = () => { }
) {
    try {
        var form = new FormData();
        form.append("file", fileObject);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/console/api-upload-page-resources/" + pageRoute, true);
        xhr.send(form)
        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                _successCallback();
                return;
            } else if (xhr.readyState == 4) {
                _failCallback();
                return;
            };
        };
    } catch{

    }
}

export function uploadPageMarkdown(mdStr: string,
    pageRoute: string,
    _successCallback: () => void = () => { },
    _failCallback: () => void = () => { }
) {
    try {
        var form = new FormData();
        form.append("file", mdStr);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/console/api-upload-markdown/" + pageRoute, true);
        xhr.send(form)
        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                _successCallback();
                return;
            } else if (xhr.readyState == 4) {
                _failCallback();
                return;
            };
        };
    } catch{

    }
}


export function validateToken(userName: string,
    password: string,
    _successCallback: () => void = () => { },
    _failCallback: () => void = () => { }
) {
    try {
        var form = new FormData();
        form.append("username", userName);
        form.append("password", password);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/console/api-login/", true);
        xhr.send(form)
        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (JSON.parse(xhr.response.text).result = "success")
                    _successCallback();
                else
                    _failCallback();
                return;
            } else if (xhr.readyState == 4) {
                _failCallback();
                return;
            };
        };
    } catch{

    }
}