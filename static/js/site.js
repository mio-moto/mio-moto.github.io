window.addEventListener('DOMContentLoaded', () => {
    'use strict';
    
    [...document.getElementsByTagName("nav")].forEach(x => registerNavigation(x, ["section", "fragment"]));

    document.getElementById("theme-toggle").addEventListener("click", (e) => {
        if(e.target.checked) {
            document.body.classList.remove("dark");
        } else {
            document.body.classList.add("dark");
        }
    })
  });

  /**
   * 
   * @param {HTMLElement} navElement 
   */
  const traverseTree = (navElement) => {
    const ids = [];
    for(let element = navElement.parentNode; element !== null; element = element.parentNode) {
        if(element.id) {
            ids.push(element.id);
        }
    }
    return ids.reverse();
  }

  /**
   * @param {HTMLElement} element 
   */
  const hashHref = (element) => element.getAttribute("href").replace("#", "");

  /**
   * Hook up events under the assumption that there's 
   * @param {HTMLElement} navElement required element that's the navigation of layout <nav><a/><a/>...</nav>
   * @param {string[]} childTagNames required tag names that are adjacent to the nav <parent><nav/><tagName/><tagName/>...</parent>
   */
  const registerNavigation = (navElement, childTagNames) => {
    const parentNavigation = traverseTree(navElement);
    const parentFragment = parentNavigation.length <= 0 ? "" : `/${parentNavigation.join("/")}`;
    const targetElements = ([...navElement.parentElement.childNodes.values()]).filter(x => childTagNames.includes(x.tagName?.toLowerCase()));
    const linkTargets = [...navElement.childNodes.values()].filter(x => (x.tagName?.toLowerCase() === "a"));
    const hrefs = linkTargets.map(x => hashHref(x));

    // primary method to switch child views based on top nav
    const setNavElementActive = (activeNav, enableUri) => {
        // disable all elements, reset
        targetElements.forEach(x => x.style.display = "none");
        linkTargets.forEach(x => x.classList.remove("selected"));
        // get the id and its associated active view element
        const id = hashHref(activeNav);
        if(enableUri) {
            const uri = `#${parentFragment}/${id}`;
            document.location.hash = uri;
        }
        const activeView = targetElements.find(x => x.id === id);
        if(!activeView) {
            console.error(`no nav element fitting the name of ${id}`);
            return;
        }
        // set them visible and active
        activeView.style.display = 'inherit';
        activeNav.classList.add("selected");
    }

    const activateDocumentLocation = () => {
        const location = document.location.hash.replace("#", "");
        const components = location.split("/").filter(x => x.length > 0);
        const targetViewId = components.slice(0, parentNavigation.length + 1).pop();
        const hrefIndex = hrefs.indexOf(targetViewId);
        if(hrefIndex < 0) {
            setNavElementActive(linkTargets[0], false);
            return;
        }
        setNavElementActive(linkTargets[hrefIndex], false);
    }
    activateDocumentLocation();

    // set the first nav element as active (as a reasonable guess)
    // setNavElementActive(linkTargets[0]);
    // hook up the on-click event - prevent scrolling and history pushing
    linkTargets.forEach(x => x.addEventListener("click", (e) => {
        e.preventDefault();
        setNavElementActive(x, true);
        return false;
    }))
}
