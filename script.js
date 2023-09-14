let glData = undefined;

function setGlData() {
    localStorage.setItem("cache", JSON.stringify(glData));
}
function loadGlData() {
    let _glData = localStorage.getItem("cache");
    if (_glData == null) {
        glData = [];
        setGlData();
    }
    else glData = JSON.parse(_glData);
}

loadGlData();

function resumeDataStrip() {
    let ret = {
        name: '',
        contactDetails: [],
        skills: [],
        education: [],
        projects: [],
        experience: [],
        certificates: [],
    };
    let fieldToStrip = ["contactDetails", "skills", "education", "projects", "experience", "certificates"];

    function inputStripFromTable(tableId, object) {
        let table = document.getElementById(tableId);
        let filed = table.getElementsByTagName("tr");
        for (var i = 1; i < filed.length; i++) {
            let valuefields = filed[i].getElementsByClassName("resumeInput");
            let temp = [];
            let flg = true;
            for (let j = 0; j < valuefields.length; j++) {
                temp.push(valuefields[j].type == "checkbox" ? valuefields[j].checked : valuefields[j].value);
                if (valuefields[j].type != "checkbox") {
                    if (valuefields[j].value == "") {
                        alert("you left this field empty");
                        flg = false;
                        break;
                    }
                }
            }
            if (flg) object[tableId].push(temp);
        }
    }

    fieldToStrip.forEach((e) => {
        inputStripFromTable(e, ret);
    });

    ret.name = document.getElementById("name").value;
    if (ret.name == "") alert("you left this field empty");

    return ret;
}


const CONTANT_PUSH_HEADER = 2;
const CONTACT_VALUE = 1;
const CONTACT_LABEL = 0;

function renderResume(obj) {
    let getheader = (obj) => {
        let node = document.createElement("header");
        let name = document.createElement("span");
        name.innerText = obj.name;
        name.classList = "large";

        let hrline = document.createElement("hr");
        hrline.classList = "white partial-length";


        let headerContact = document.createElement("span");
        headerContact.classList = "small italics";

        for (let i = 0; i < obj.contactDetails.length; i++) {
            if (!obj.contactDetails[i][CONTANT_PUSH_HEADER]) continue;
            let val = document.createElement("span");
            val.innerText = obj.contactDetails[i][CONTACT_VALUE];
            headerContact.appendChild(val);
            headerContact.innerHTML += " | ";
        }

        headerContact.innerHTML = headerContact.innerHTML.substring(0, headerContact.innerHTML.length - 2);

        node.appendChild(name);
        node.appendChild(hrline);
        node.appendChild(headerContact);
        return node;
    }

    let getLeftBar = (obj) => {
        let node = document.createElement("div");
        node.classList = "skills";

        let nodeContact = document.createElement("div");
        nodeContact.classList = "content-row";

        let crh = document.createElement("span");
        crh.classList = "medium section-heading";
        crh.innerText = "Contact Information";

        let crh_d = document.createElement("div");

        for (let i = 0; i < obj.contactDetails.length; i++) {
            let elem = document.createElement("a");
            elem.innerText = obj.contactDetails[i][CONTACT_LABEL];
            elem.setAttribute("href", obj.contactDetails[i][CONTACT_VALUE]);
            crh_d.appendChild(elem);
            crh_d.innerHTML += " | ";
        }

        crh_d.innerHTML = crh_d.innerHTML.substr(0, crh_d.innerHTML.length - 2);

        nodeContact.appendChild(crh);
        nodeContact.appendChild(crh_d);

        let nodeSkills = document.createElement("div");
        nodeSkills.classList = "content-row";

        crh = document.createElement("span");
        crh.classList = "medium section-heading";
        crh.innerText = "Skills";

        crh_d = document.createElement("div");
        for (let i = 0; i < obj.skills.length; i++) {
            crh_d.innerHTML += obj.skills[i];
            crh_d.innerHTML += " | ";
        }

        crh_d.innerHTML = crh_d.innerHTML.substr(0, crh_d.innerHTML.length - 2);

        nodeSkills.appendChild(crh);
        nodeSkills.appendChild(crh_d);

        node.appendChild(nodeContact);
        node.appendChild(nodeSkills);
        return node;
    }

    let getRightBar = (obj) => {
        let node = document.createElement("div");
        node.classList = "documental";


        let getRightBarRow = (name, content) => {
            let node = document.createElement("div");
            node.classList = "content-row";

            let nodeHeader = document.createElement("span");
            nodeHeader.classList = "medium section-heading";
            nodeHeader.innerText = name;

            let nodeSection = document.createElement("div");
            nodeSection.classList = "section";

            nodeSection.innerHTML = content;

            node.appendChild(nodeHeader);
            node.appendChild(nodeSection);
            return node;
        }

        // education

        let noderow = getRightBarRow("Educational Qualifications", ((obj) => {
            let ret = "";
            for (let i = 0; i < obj.education.length; i++) {
                let node = document.createElement("div");
                node.classList = "section-row";

                let node_head1 = document.createElement("div");
                node_head1.innerText = obj.education[i][0];
                node_head1.classList = "sub-medium";

                let node_head2 = document.createElement("div");
                node_head2.innerText = obj.education[i][1];

                let node_position = document.createElement("div");
                node_position.classList = "position-details";
                node_position.style.paddingBottom = "10px";

                let position_duration = document.createElement("span");
                position_duration.innerText = obj.education[i][2];
                position_duration.classList = "italics grey small";

                let position_marks = document.createElement("span");
                position_marks.innerText = obj.education[i][3];
                position_marks.classList = "italics grey small";

                node_position.appendChild(position_duration);
                node_position.appendChild(position_marks);

                node.appendChild(node_head1);
                node.appendChild(node_head2);
                node.appendChild(node_position);

                ret += node.outerHTML;
            }
            return ret;
        })(obj));
        node.appendChild(noderow);

        // projects

        noderow = getRightBarRow("Projects", ((obj) => {
            let ret = "";

            for (let i = 0; i < obj.projects.length; i++) {
                let node = document.createElement("div");
                node.classList = "section-row";

                let node_head1 = document.createElement("div");
                node_head1.innerText = obj.projects[i][0];
                node_head1.classList = "sub-medium";

                let node_head2 = document.createElement("div");
                node_head2.innerText = obj.projects[i][1];
                node_head2.classList = "italics";
                node_head2.style.paddingBottom = "10px";

                node.appendChild(node_head1);
                node.appendChild(node_head2);

                ret += node.outerHTML;
            }

            return ret;
        })(obj));
        if(obj.projects.length != 0)
            node.appendChild(noderow);

        // experience

        noderow = getRightBarRow("Experience", ((obj) => {
            let ret = "";

            for (let i = 0; i < obj.experience.length; i++) {
                let node = document.createElement("div");
                node.classList = "section-row";

                let node_head = document.createElement("div");
                node_head.innerText = obj.experience[i][0];
                node_head.classList = "sub-medium";

                let node_head1 = document.createElement("div");
                node_head1.classList = "position-details";
                let pd = document.createElement("span");
                pd.classList = "italics grey small";
                pd.innerText = obj.experience[i][1];
                node_head1.appendChild(pd);

                let node_head2 = document.createElement("div");
                node_head2.innerText = obj.experience[i][2];
                node_head2.classList = "italics";
                node_head2.style.paddingBottom = "10px";

                node.appendChild(node_head);
                node.appendChild(node_head1);
                node.appendChild(node_head2);

                ret += node.outerHTML;
            }

            return ret;
        })(obj));
        if(obj.experience.length !=0)
            node.appendChild(noderow);

        // certificates

        noderow = getRightBarRow("Certificates", ((obj) => {
            let ret = "";

            for (let i = 0; i < obj.certificates.length; i++) {
                let node = document.createElement("div");
                node.classList = "section-row italics";
                node.innerText = `${i + 1}. ${obj.certificates[i]}`;
                ret += node.outerHTML;
            }

            return ret;
        })(obj));
        if(obj.certificates.length != 0)
            node.appendChild(noderow);

        return node;
    }

    let getContentBar = (obj) => {
        let fieldToStrip = ["contactDetails", "skills", "education", "projects", "experience", "certificates"];
        let node = document.createElement("div");
        node.classList = "content";
        node.appendChild(getLeftBar(obj));
        node.appendChild(getRightBar(obj));
        return node;
    }

    let gl_ret = {};
    gl_ret.outerHTML = getheader(obj).outerHTML + getContentBar(obj).outerHTML;
    return gl_ret;
}

document.getElementById("resumeRender").addEventListener("click", (e) => {
    let ret = resumeDataStrip();
    console.log(JSON.stringify(ret, null, 2));
    if(ret.name == "") {
        alert("atleast give name or some field values");
        return;
    }

    let markup = renderResume(ret);
    document.getElementById("renderResult").innerHTML = markup.outerHTML;
    alert("this is just a render, click push to save it");
});

document.getElementById("resumeSave").addEventListener("click", (e) => {
    let ret = resumeDataStrip();
    console.log(JSON.stringify(ret, null, 2));

    if(ret.name == "") {
        alert("atleast give name or some field values");
        return;
    }

    let queryStr = window.location.search;
    let urlParams = new URLSearchParams(queryStr);
    let resumeId = urlParams.get("id");
    if (resumeId == null) {
        glData.push(ret);
    }
    else {
        glData[resumeId] = ret;
    }
    setGlData();
    let markup = renderResume(ret);
    document.getElementById("renderResult").innerHTML = markup.outerHTML;
    alert("Successfully Saved the Resume");
    footerUpdate();
});

document.getElementById("resumeDelete").addEventListener("click", (e) => {
    let queryStr = window.location.search;
    let urlParams = new URLSearchParams(queryStr);
    let resumeId = urlParams.get("id");

    let flg = confirm("are you sure to delete current resume");
    if(!flg) {
        return;
    }
    glData.splice(resumeId, 1);
    setGlData();
    alert("current resume was delete");
    window.location.replace("/");
});



function getDeleteAction(node, parent) {
    let del_action = document.createElement("button");
    del_action.innerText = "-";
    del_action.addEventListener("click", (e) => {
        parent.removeChild(node);
    });
    return del_action;
}

var row;

function start(){  
  row = event.target; 
}
function dragover(){
  var e = event;
  e.preventDefault(); 
  
  let children= Array.from(e.target.parentNode.parentNode.children);
  
  if(children.indexOf(e.target.parentNode)>children.indexOf(row))
    e.target.parentNode.after(row);
  else
    e.target.parentNode.before(row);
}

function addMoreFunctionality(buttonId, parentId, types) {
    document.getElementById(buttonId).addEventListener("click", (e) => {
        let table = document.getElementById(parentId);
        let node = document.createElement("tr");
        node.draggable = true;
        node.setAttribute("ondragstart", "start()");
        node.setAttribute("ondragover", "dragover()");

        let makeinput = (type) => {
            let ret = undefined;
            if (type[0] == '!') {
                ret = document.createElement(type.substr(1));
            }
            else {
                ret = document.createElement("input");
                ret.type = type;
            }
            ret.classList = "resumeInput";

            let temp = document.createElement("td");
            temp.appendChild(ret);
            return temp;
        };

        types.forEach(type => {
            node.appendChild(makeinput(type));
        });

        function getDeleteAction(node, parent) {
            let del_action = document.createElement("button");
            del_action.innerText = "-";
            del_action.addEventListener("click", (e) => {
                parent.removeChild(node);
            });
            return del_action;
        }

        node.appendChild(getDeleteAction(node, table));

        table.appendChild(node);
    });
}

addMoreFunctionality("addContactEntryRow", "contactDetails", ["text", "text", "checkbox"]);
addMoreFunctionality("addSkillsEntryRow", "skills", ["text"]);
addMoreFunctionality("addEducationEntryRow", "education", ["text", "text", "text", "text"]);
addMoreFunctionality("addProjectEntryRow", "projects", ["text", "!textarea"]);
addMoreFunctionality("addExperienceEntryRow", "experience", ["text", "text", "!textarea"]);
addMoreFunctionality("addCertificateEntryRow", "certificates", ["text"]);


let onLoadFormBuild = (parentId, types, values) => {
    if (values.length == 0) return;
    let table = document.getElementById(parentId);
    let makeinput = (type, value) => {
        let ret = undefined;
        if (type[0] == '!') {
            ret = document.createElement(type.substr(1));
            ret.value = value;
        }
        else {
            ret = document.createElement("input");
            ret.type = type;
            if (type == "checkbox")
                ret.checked = value;
            else
                ret.value = value;
        }
        ret.classList = "resumeInput";

        let temp = document.createElement("td");
        temp.appendChild(ret);
        return temp;
    };
    for (let i = 0; i < values.length; i++) {
        let node = document.createElement("tr");
        node.draggable = true;
        node.setAttribute("ondragstart", "start()");
        node.setAttribute("ondragover", "dragover()");
        
        for (let j = 0; j < values[i].length; j++) {
            node.appendChild(makeinput(types[j], values[i][j]));
        }
        function getDeleteAction(node, parent) {
            let del_action = document.createElement("button");
            del_action.innerText = "-";
            del_action.addEventListener("click", (e) => {
                parent.removeChild(node);
            });
            return del_action;
        }

        node.appendChild(getDeleteAction(node, table));
        table.appendChild(node);
    }
}

let footerUpdate = (toSkip) => {
    let node = document.getElementById("listPages");
    node.innerHTML = "your previous saves:";
    let link = document.createElement("a");
    link.innerText = "New";
    link.href = `/`;
    node.appendChild(link);
    for(let i=0; i < glData.length; i++) {
        if(toSkip == i) continue;
        let link = document.createElement("a");
        link.innerText = i;
        link.href = `/?id=${i}`;
        node.appendChild(link);
    }
}

let onLoad = () => {
    let queryStr = window.location.search;
    let urlParams = new URLSearchParams(queryStr);
    let resumeId = urlParams.get("id");
    footerUpdate(resumeId);
    if (resumeId == null) return;
    document.getElementById("resumeSave").innerText = "SAVE";
    document.getElementById("resumeDelete").removeAttribute("hidden");
    if (resumeId >= glData.length) {
        alert("you made invalid request");
        window.location.replace("/");
    }
    let markup = renderResume(glData[resumeId]);
    document.getElementById("renderResult").innerHTML = markup.outerHTML;


    let fieldToFormBuild = [
        {
            "name": "contactDetails",
            "types": ["text", "text", "checkbox"]
        },
        {
            "name": "skills",
            "types": ["text"]
        },
        {
            "name": "education",
            "types": ["text", "text", "text", "text"]
        },
        {
            "name": "projects",
            "types": ["text", "!textarea"]
        },
        {
            "name": "experience",
            "types": ["text", "text", "!textarea"]
        },
        {
            "name": "certificates",
            "types": ["text"]
        }];
    for (let i = 0; i < fieldToFormBuild.length; i++) {
        onLoadFormBuild(fieldToFormBuild[i]["name"], fieldToFormBuild[i]["types"], glData[resumeId][fieldToFormBuild[i]["name"]]);
    }
    document.getElementById("name").value = glData[resumeId]["name"];
}

onLoad();