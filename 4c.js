//let board = document.getElementsByClassName("board")[0];
let thread = document.getElementsByClassName("thread")[0];
setupLinks(thread);
setupListeners(thread);

function setupLinks(root){
    let backlinks = root.getElementsByClassName("backlink");
    
    for (let i = 0; i < backlinks.length; i++){
        let el = backlinks[i];
        let post = el.parentNode.parentNode;
        let link = document.createElement("a");
        link.className = "viewlink";
        link.text = "view replies";
        //need to setup an id too id = "vl_" + post.id 
        el.appendChild(link);
    }
};

function setupListeners(root){
    let viewlinks = root.getElementsByClassName("viewlink");
    for (let i = 0; i < viewlinks.length; i++){
        let el = viewlinks[i];
        let post = el.parentNode.parentNode;
        viewlinks[i].addEventListener("click", (e) => viewReplies(e,post));
        //link.addEventListener("mouseover", cb_mouseover);
    }
}

function getReplies(viewlink){ // should return array cloned divs with modded Ids
    let backlink = viewlink.parentNode.parentNode;
    let quotelinks = Array.from(backlink.getElementsByClassName("quotelink"));
    let replies = quotelinks.map( function(val){
        let id = val.text.slice(2);
        return document.getElementById("pc" + id).cloneNode(true); // "pc" : prefix for post container
    });
    return replies;
};

function viewReplies(e, post){
    console.log("viewReplies");
    let t = e.target;
    let repliescontainer = document.createElement("div");
    let replies = getReplies(t); // an array with clones of replies
    replies.forEach(function(val){
        repliescontainer.appendChild(val);    
    });
    
    // create a "clear replies" btn below the replies
    let child = document.createElement("span");
    let clearbtn = document.createElement("a");
    clearbtn.text = "clear replies";
    clearbtn.addEventListener("click",clearReplies);
    child.appendChild(clearbtn);
    repliescontainer.appendChild(child);
    
    // wrap pc in a local thread
    let pc = post.parentNode;
    let localthread = document.createElement("div");
    pc.parentNode.insertBefore(localthread,pc);
    localthread.appendChild(pc);
    localthread.appendChild(repliescontainer);
    
    pc.style.display = "table-cell";
    repliescontainer.style.display = "table-cell";

    setupListeners(repliescontainer);
    console.log(t);
    t.removeEventListener("click",viewReplies);
    //listeners don't match, the listener is an anonymous function
};

function clearReplies(e){
    console.log("clearReplies");
    let t = e.target;
    let repliescontainer = t.parentNode.parentNode;
    let localthread = repliescontainer.parentNode;
    let localOPcontainer = localthread.firstChild;
    localthread.parentNode.insertBefore(localOPcontainer,localthread);
    localthread.remove();
    setupListeners(localOPcontainer);
};