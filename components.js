class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.outerHTML = `
    <header>
        <q>Visit <a href="https://www.022150.xyz/">www.022150.xyz</a> today!</q>
        <hr>
        <nav>
            <ul>
                <li><a href="./index.html">Home</a></li>
                <li><a href="./document.html">Documents</a></li>
            </ul>
        </nav>
    </header>
    `;
  }
}
customElements.define('site-header', SiteHeader);

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.outerHTML = `
    <footer>
        <p><b>Built without ads or trackers.</b></p>
        <p>Like this style? Feel free to use it yourself!<br><a href="https://github.com/Artzert2215/www.022150.xyz">View the source code of this site.</a></p>
        <small>Last update: 30 May 2026</small>
    </footer>
    `;
  }
}
customElements.define('site-footer', SiteFooter);