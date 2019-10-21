//
// Copyright (c) 2019 Elastos Foundation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//

function set_msg(side, avatar, content) {
    var data = new Date();
    var msg = '<li class="' + side + '">' +
        '<a class="user" href="#">' +
        '<img class="img-responsive avatar_" src="./img/' + avatar + '.png" alt=""></a>' +
        '<div class="reply-content-box">' +
        '<span class="reply-time">' + data.toLocaleTimeString() + '</span>' +
        '<div class="reply-content pr"><span class="arrow">&nbsp;</span>' +
        content + '</div></div></li>';
    $("#msg_content").append(msg);
    $("html, body").animate({ scrollTop: $(document).height()}, "slow");
}

function display_me_msg(content) {
    set_msg("me", "avatar", content);
}

function display_others_msg(content) {
    set_msg("other", "avatar_rob", content);
}

var commands = [
// plugin commands
    { cmd: "test",      fn: test,                   help: "test"  },
    { cmd: "openjson",      fn: openjson,                   help: "openjson"  },
    { cmd: "help",      fn: help,                   help: "help [cmd]"  },
    { cmd: "version",   fn: get_version,            help: "version"     },
    { cmd: "createdoc", fn: createDocument,         help: "createdoc json"     },
    { cmd: "ccred",     fn: createCredential,       help: "ccred "     },

// DidStore
    { cmd: "init",     fn: initDIDStore,           help: "init"       },
    { cmd: "hasp",     fn: hasPrivateID,           help: "hasp"       },
    { cmd: "initp",    fn: initPrivateID,          help: "initp"      },
    { cmd: "listdid",  fn: listDids,               help: "listdid type"      },
    { cmd: "listc",    fn: listCredentials,        help: "listdid type"      },
    { cmd: "newdid",   fn: newDID,                 help: "newdid"     },
    { cmd: "storedid", fn: storeDid,               help: "storedid"     },
    { cmd: "createdid",   fn: createDID,           help: "createdid"     },
    { cmd: "storec",   fn: storeCredential,        help: "storec"     },

// DidDocment
    { cmd: "getsub",    fn: getSubject,             help: "getsub"     },
    { cmd: "getpkc",    fn: getPublicKeyCount,      help: "getpkc"     },
    { cmd: "getdpk",    fn: getDefaultPublicKey,    help: "getdpk"     },
    { cmd: "addc",     fn: addCredential,          help: "addvc"     },
// Did
    { cmd: "getm",      fn: getMethod,              help: "getm"     },
    { cmd: "getms",     fn: getMethodSpecificId,    help: "getms"     },
    { cmd: "tostr",     fn: didToString,            help: "tostr"     },
//PublicKey
    { cmd: "getpkb",    fn: getPublicKeyBase58,     help: "getpkb"     },
    { cmd: "getc",      fn: getController,          help: "getc"       },
//Credential
    { cmd: "geti",      fn: getInfo,                help: "geti"     },

    { cmd: "exit",      fn: exit,                   help: "exit"        }
]

function do_command(input) {
    var args = input.trim().match(/[^\s"]+|"([^"]*)"/g);
    if (!args || args[0] == "") {
        return;
    }

    args[0] = args[0].toLowerCase()

    for (var i = 0; i < commands.length; i++) {
        if (commands[i].cmd == args[0]) {
            commands[i].fn(args);
            return;
        }
    }
    display_others_msg("Unknown command:" + args[0]);
}

function help(args) {
    if (args.length > 1) {
        for (var i = 0; i < commands.length; i++) {
            if (commands[i].cmd == args[1]) {
                display_others_msg("Usage: :" + commands[i].help);
                return;
            }
        }
        display_others_msg("Usage: :" + commands[0].help);
    }
    else {
        var msg = "Available commands list: </br>"
        for (var i = 0; i < commands.length; i++) {
            msg += "&nbsp;&nbsp;" + commands[i].help + "</br>";
        }
        display_others_msg(msg);
    }
}

function exit(args) {
    appService.close();
}

function onLauncher() {
    appService.launcher();
}

function onClose() {
    appService.close();
}

function test(args) {
//     var dic = new Array();
//     dic['a'] = "test1";
//     dic['b'] = "test2";
    let dic = {
        test: "ok",
        test2: "test2"
    }

    let jsArray = new Array();
    jsArray[0] = "Saab";
    jsArray[1] = "Volvo";
    jsArray[2] = "BMW";
//    dic.test = "ok";
//    dic.test2= "test2";

    DIDPlugin.jsonArrayTest(
        function (version) {
            display_others_msg(version);
        },
        function (error) {
            display_others_msg("Get version error! " + error);
        },
        dic,
        jsArray
    );
}

function get_version(args) {
    DIDPlugin.getVersion(
        function (version) {
            display_others_msg(version);
        },
        function (error) {
            display_others_msg("Get version error! " + error);
        }
    );
}

function initDIDStore(args) {
     DIDPlugin.initDidStore(
         function (ret) {
             didStore = ret;
             display_others_msg("initDidStore success " + ret.objId);
         },
         function (error) {
             display_others_msg("initDIDStore error! " + error);
         }
     );
 }

function createDocument(args) {
    DIDPlugin.CreateDIDDocumentFromJson(
        function (ret) {
            diddocment = ret;
            display_others_msg("CreateDIDDocumentFromJson success " + ret.objId);
        },
        function (error) {
            display_others_msg("CreateDIDDocumentFromJson error! " + error);
        },
        documentJson
    );
 }

function createCredential(args) {
    let types = new Array();
        types[0] = "BasicProfileCredential";
        types[1] = "SelfProclaimedCredential";

    let props = {
        name: "elastos",
        email: "test@elastos.org",
        phone: "11111"
    }


    DIDPlugin.CreateCredential(
        function (ret) {
            vc = ret;
            display_others_msg("createCredential success " + ret.objId);
        },
        function (error) {
            display_others_msg("createCredential error! " + error);
        },
        did.objId,
        "cred-1",
        types,
        15,
        props,
        "123456"
    );
}

function hasPrivateID(args) {
    didStore.hasPrivateIdentity(
        function (ret) {
            display_others_msg("hasPrivateIdentity: " + ret.hasPrivateIdentity);
        },
        function (error) {
            display_others_msg("hasPrivateIdentity error! " + error);
        }
    );
}

function initPrivateID(args) {
    didStore.initPrivateIdentity(
        function (ret) {
            display_others_msg("initPrivateID: " + ret);
        },
        function (error) {
            display_others_msg("initPrivateID error! " + error);
        },
        "蓄蓄蓄蓄蓄蓄蓄蓄蓄蓄蓄蓄", "", true
    );
}

function newDID(args) {
    didStore.newDID(
        function (ret) {
            diddocment = ret;
            display_others_msg("newDID: " + ret.objId);
        },
        function (error) {
            display_others_msg("newDID error! " + error);
        },
        "123456",
        "didtest"
    );
}

function storeDid(args) {
    didStore.storeDid(
        function (ret) {
            display_others_msg("storeDid: " + ret);
        },
        function (error) {
            display_others_msg("storeDid error! " + error);
        },
        diddocment.objId,
        "didtest"
    );
}

function storeCredential(args) {
    didStore.storeCredential(
        function (ret) {
            publickey = ret;
            display_others_msg("storeCredential: " + ret);
        },
        function (error) {
            display_others_msg("storeCredential error! " + error);
        },
        vc.objId
    );
}

function createDID(args) {
//    didStore.newDID(
//        function (ret) {
//            display_others_msg("newDID: " + ret.objId);
//        },
//        function (error) {
//            display_others_msg("newDID error! " + error);
//        }
//    );
}

function listDids(args) {
    didStore.listDids(
        function (ret) {
            display_others_msg("listDids count: " + ret.items.length + "<br>" + JSON.stringify(ret.items));
        },
        function (error) {
            display_others_msg("listDids error! " + error);
        },
        2
    );
}


function listCredentials(args) {
    didStore.listCredentials(
        function (ret) {
            display_others_msg("listCredentials count: " + ret.items.length+ "<br>" + JSON.stringify(ret.items));
        },
        function (error) {
            display_others_msg("listCredentials error! " + error);
        },
        did.objId
    );
}

// DIDDocument
function getSubject(args) {
    diddocment.getSubject(
        function (ret) {
            did = ret;
            display_others_msg("getSubject: " + ret.objId);
        },
        function (error) {
            display_others_msg("getSubject error! " + error);
        },
    );
}

function getPublicKeyCount(args) {
    diddocment.getPublicKeyCount(
        function (ret) {
            display_others_msg("getPublicKeyCount: " + ret);
        },
        function (error) {
            display_others_msg("getPublicKeyCount error! " + error);
        },
    );
}

function getDefaultPublicKey(args) {
    diddocment.getDefaultPublicKey(
        function (ret) {
            publickey = ret;
            display_others_msg("getDefaultPublicKey: " + ret.objId);
        },
        function (error) {
            display_others_msg("getDefaultPublicKey error! " + error);
        },
    );
}

function addCredential(args) {
    diddocment.addCredential(
        function (ret) {
            display_others_msg("addCredential: " + ret);
        },
        function (error) {
            display_others_msg("addCredential error! " + error);
        },
        vc.objId
    );
}

//DID
function getMethod(args) {
    did.getMethod(
        function (ret) {
            display_others_msg("DID getMethod: " + ret);
        },
        function (error) {
            display_others_msg("DID getMethod error! " + error);
        },
    );
}

function getMethodSpecificId(args) {
    did.getMethodSpecificId(
        function (ret) {
            display_others_msg("DID getMethodSpecificId: " + ret);
        },
        function (error) {
            display_others_msg("DID getMethodSpecificId error! " + error);
        },
    );
}

function didToString(args) {
    did.toString(
        function (ret) {
            display_others_msg("DID toString: " + ret);
        },
        function (error) {
            display_others_msg("DID toString error! " + error);
        },
    );
}

//PublicKey
function getPublicKeyBase58(args) {
    publickey.getPublicKeyBase58(
        function (ret) {
            display_others_msg("getPublicKeyBase58: " + ret);
        },
        function (error) {
            display_others_msg("getPublicKeyBase58 error! " + error);
        },
    );
}

function getController(args) {
    publickey.getController(
        function (ret) {
            did = ret;
            display_others_msg("getController: " + ret);
        },
        function (error) {
            display_others_msg("getController error! " + error);
        },
    );
}

//Credential
function getInfo(args) {
    vc.getFragment(
        function (ret) {
            display_others_msg("getFragment: " + ret);
        },
        function (error) {
            display_others_msg("getFragment error! " + error);
        },
    );

    vc.getType(
        function (ret) {
            display_others_msg("getType: " + ret);
        },
        function (error) {
            display_others_msg("getType error! " + error);
        },
    );

    vc.getIssuanceDate(
        function (ret) {
            display_others_msg("getIssuanceDate: " + ret);
        },
        function (error) {
            display_others_msg("getIssuanceDate error! " + error);
        },
    );

    vc.getExpirationDate(
        function (ret) {
            display_others_msg("getExpirationDate: " + ret);
        },
        function (error) {
            display_others_msg("getExpirationDate error! " + error);
        },
    );

    vc.getPropertys(
        function (ret) {
            display_others_msg("getPropertys: " + JSON.stringify(ret));
        },
        function (error) {
            display_others_msg("getPropertys error! " + error);
        },
    );


}

function openjson(args) {
    openLocalFile("testdiddoc.json");
}

function errorHandler(e) {
    console.log('Error: ' + e.code);
}

function readFile(fileEntry) {
    fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function() {
            documentJson = this.result;
        };
        reader.readAsText(file);
    }, errorHandler);
}

function openLocalFile(filename){
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function (fs) {
        fs.getFile(filename, { create: false }, readFile, errorHandler);
    });
}


let didStore = null;
let diddocment = null;
let did  = null;
let publickey = null;
let documentJson = null;
let vc = null;

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function () {
        do_command("init");
        do_command("help");

        $("input").focus();
        $("input").bind('keypress', function (event) {
            if (event.keyCode == "13") {
                var content = $('input').val()
                if (content.trim() != "") {
                    display_me_msg($('input').val());
                    do_command($('input').val());
                    $('input').val('');
                }
            }
        });
    },
};

app.initialize();
