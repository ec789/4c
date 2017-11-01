//let board = document.getElementsByClassName("board")[0];
let thread = document.getElementsByClassName("thread")[0];
setLinks(thread);
setListeners(thread);

function setLinks(root){
    let backlinks = root.getElementsByClassName("backlink");
    
    for (let i = 0; i < backlinks.length; i++){
        let el = backlinks[i];
        let post = el.parentNode.parentNode;

        let viewlink = document.createElement("a");
        viewlink.className = "viewlink";
        viewlink.text = "view replies";
        //viewlink.pc = pc;
        el.appendChild(viewlink);
    }
};

function setListeners(root){
    let viewlinks = root.getElementsByClassName("viewlink");
    for (let i = 0; i < viewlinks.length; i++){
        let el = viewlinks[i];
        let post = el.parentNode.parentNode;
        let pc = post.parentNode;
        viewlinks[i].addEventListener("click", threadify, {once :true});
        //link.addEventListener("mouseover", cb_mouseover);
    }   
}

// returns the first ancestor of node with className in its className
function getParentByClassname(node, className){
    let p = node.parentNode;
    if (p.classList.contains(className)){
        return p;
    } else {
        return getParentByClassname(p, className);
    }

}

function getReplies(viewlink){ // should return an array of cloned divs with modded Ids
    //let backlink = viewlink.parentNode.parentNode;
    let backlink = getParentByClassname(viewlink, "backlink");
    let quotelinks = Array.from(backlink.getElementsByClassName("quotelink"));
    let replies = quotelinks.map( function(val){
        let postNumber = val.text.slice(2);
        return document.getElementById("pc" + postNumber).cloneNode(true); // "pc" : prefix for post container
        //return cloneNodeSpecial(document.getElementById("pc" + postNumber), true);
    });
    return replies;
};

//returns clone with a modified id
function cloneNodeSpecial(node, deep){
    console.log("cloneNodeSpecial");
    console.log(node);
    let clone = node.cloneNode(false);
    if (clone.id !== "") {
        clone.id += "-c";
    }
    if (!deep){
        return clone;
    } else {
        Array.from(node.children).forEach(
            val => clone.appendChild(cloneNodeSpecial(val, true))
        );
        return clone;
    }

}

function threadify(e){
    console.log("threadify");
    let t = e.target;
    console.log(t.pc);
    
    let createClearBtn = function(){
        let child = document.createElement("span");
        let clearbtn = document.createElement("a");
        clearbtn.text = "clear replies";
        clearbtn.addEventListener("click", dethreadify);
        child.appendChild(clearbtn);
        return child;
    }
    
    let repliescontainer = document.createElement("div");
    let replies = getReplies(t); // an array with clones of replies
    repliescontainer.appendChild(createClearBtn());
    replies.forEach(function(val){
        repliescontainer.appendChild(val);    
    });
    repliescontainer.appendChild(createClearBtn());
    
    // wrap pc in a local thread
    let pc = getParentByClassname(t, "postContainer");
    let localthread = document.createElement("div");
    localthread.className = "thread";
    pc.parentNode.insertBefore(localthread,pc);
    localthread.appendChild(pc);
    localthread.appendChild(repliescontainer);
    
    //
    pc.style.display = "table-cell"; // to be cancelled in dethreadify
    repliescontainer.style.display = "table-cell";
    
    // set listeners for the cloned posts
    // bc cloneNode() don't clone event listeners
    setListeners(repliescontainer);
    
};

// best way to get the thread ?
// - take it as a parameter (clearlink element is given a thread property)
// - look for it up the tree 
// - give id to clearlink and look for it through id
function dethreadify(e){
    console.log("dethreadify");
    let t = e.target;
    let localthread = getParentByClassname(t, "thread");
    let localOPcontainer = localthread.firstChild;
    
    localthread.parentNode.insertBefore(localOPcontainer,localthread);
    localthread.remove();

    localOPcontainer.style.display = "";
    
    setListeners(localOPcontainer);
};