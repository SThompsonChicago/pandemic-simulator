import React from 'react';

const styles = {
  hov: {
    cursor: 'pointer',
  },
  right: {
    float: "right",
  },
  space: {
    margin:"5px",
  },
}

function Header({currentPage, handlePageChange }) {
    return (
        <div>
        <section className="hero notification is-black">
            
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
                    Epidemic Simulator
                </p>
                <p className="subtitle">
                    A tool for visualizing spatial disease dynamics
                </p>
</div>
                </article>
                </div>
        </section>
      {/*  <div className="hero-foot">
             <header className="navbar" style={styles.right}>

<a className="button is-black"
  style={styles.space}
    href="#simulate"
    onClick={() => handlePageChange('Simulate')}
    >
      <span>Run</span>
    </a>
    <a className="button is-black"
    style={styles.space}
    href="#stop"
    onClick={() => handlePageChange('Home')}
    >
      <span>Stop</span>
    </a>

</header> 
  </div>*/}
        </div>
    );
}

export default Header;