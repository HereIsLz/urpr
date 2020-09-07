import { stringify } from "querystring";
import { IMergedPersonaCustomedProps } from "../../interfaces/IPersonas";
import { IPageManifest } from "../../interfaces/IPageManifest";
import { IOpendataItem } from "../../interfaces/IOpendata";

import Cookies from 'js-cookie'

function getUserConfigsFromCookie() {
    let ret = { username: "", password: "" }
    if (Cookies.get("username") != undefined) {
        ret.username = Cookies.get("username")!
    }
    if (Cookies.get("password") != undefined) {
        ret.password = Cookies.get("password")!
    }
    return ret;
}


export const uploadPersonaUrl = "/console/api-upload-personas/";
export function uploadPersona(_file: File,
    _successCallback: () => void = () => { },
    _failCallback: () => void = () => { }) {
    try {
        var form = new FormData();
        form.append("file", _file);

        const cookie = getUserConfigsFromCookie();
        form.append("username", cookie.username);
        form.append("password", cookie.password);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", uploadPersonaUrl, true);

        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == 200 && JSON.parse(xhr.responseText).result == "success") {
                _successCallback();
                return;
            } else if (xhr.readyState == 4) {
                _failCallback();
                return;
            };
        };
        xhr.send(form)
    } catch{

    }
}

export function uploadOpenResource(_file: File,
    _successCallback: () => void = () => { },
    _failCallback: () => void = () => { }) {
    try {
        var form = new FormData();
        form.append("file", _file);

        const cookie = getUserConfigsFromCookie();
        form.append("username", cookie.username);
        form.append("password", cookie.password);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/console/api-upload-openresource/", true);

        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == 200 && JSON.parse(xhr.responseText).result == "success") {
                _successCallback();
                return;
            } else if (xhr.readyState == 4) {
                _failCallback();
                return;
            };
        };
        xhr.send(form)
    } catch{

    }
}

export const uploadManifestUrl = "/console/api-update-manifest/";
export function uploadManifest(manifestName: "personas" | "opendata" | "pages" | "pivot" | "banner" | "updates",
    jsonObject: Object,
    _successCallback: () => void = () => { },
    _failCallback: () => void = () => { }) {
    try {
        var form = new FormData();
        form.append("file", JSON.stringify(jsonObject));
        var xhr = new XMLHttpRequest();
        xhr.open("POST", uploadManifestUrl + manifestName, true);
        const cookie = getUserConfigsFromCookie();
        form.append("username", cookie.username);
        form.append("password", cookie.password);
        xhr.onload = function () {
            if (xhr.readyState == 4
                && xhr.status == 200
                && JSON.parse(xhr.responseText).result == "success")
                _successCallback();
            else _failCallback();
        };
        xhr.send(form)
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
        const cookie = getUserConfigsFromCookie();
        form.append("username", cookie.username);
        form.append("password", cookie.password);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/console/api-upload-image/", true);
        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == 200 && JSON.parse(xhr.responseText).result == "success") {
                _successCallback();
                return;
            } else if (xhr.readyState == 4) {
                _failCallback();
                return;
            };
        };
        xhr.send(form)
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
        const cookie = getUserConfigsFromCookie();
        form.append("username", cookie.username);
        form.append("password", cookie.password);
        form.append("file", fileObject);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/console/api-upload-page-resources/" + pageRoute, true);

        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == 200 && JSON.parse(xhr.responseText).result == "success") {
                _successCallback();
                return;
            } else if (xhr.readyState == 4) {
                _failCallback();
                return;
            };
        };
        xhr.send(form)
    } catch{

    }
}

export function uploadPageMarkdown(mdStr: string,
    pageRoute: string,
    _successCallback: () => void = () => { },
    _failCallback: () => void = () => { }
) {
    try {
        console.log(mdStr)
        var form = new FormData();
        form.append("file", mdStr);
        var xhr = new XMLHttpRequest();
        const cookie = getUserConfigsFromCookie();
        form.append("username", cookie.username);
        form.append("password", cookie.password);
        xhr.open("POST", "/console/api-upload-markdown/" + pageRoute, true);
        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == 200 && JSON.parse(xhr.responseText).result == "success") {
                _successCallback();
                return;
            } else if (xhr.readyState == 4) {
                _failCallback();
                return;
            };
        };
        xhr.send(form)
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
        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                //console.log(xhr)
                if (JSON.parse(xhr.responseText).result == "success")
                    _successCallback();
                else
                    _failCallback();
                return;
            } else if (xhr.readyState == 4) {
                _failCallback();
                return;
            };
        };
        xhr.send(form)
    } catch{

    }
}