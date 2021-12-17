import React from 'react';

function Header() {
    return (
        <div>
        <section className="hero notification is-black">
            <div className="hero-head">
  </div>
            <div className="hero-body">
                <article className="media">
                    <div className="media-left">
                    <figure className="image is-64x64"
                    >
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/94/Coronavirus._SARS-CoV-2.png" alt="Image" className="is-rounded"/>
      </figure>                
      </div>
      <div className="media-content">
                <p className="title">
                    Pandemic Simulator
                </p>
                <p className="subtitle">
                    A simplified model showing the spatial spread of diseases
                </p>
</div>
                </article>
                </div>
        </section>
        </div>
    );
}

export default Header;