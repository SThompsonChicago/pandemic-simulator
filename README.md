# Epidemic Simulator


  ## Description

  This web application makes it possible to visualize the way contagious diseases spread. It relies on a modern epidemiological model, and the user has options to vary different inputs (the effective transmission rate, the recovery rate, the population distribution and the outbreak location). Some inputs will lead to rapid infection propagation, while others will cause the disease to die out. Thus, this app creates a way to understand how different interventions can affect whether or not an epidemic is contained. 
  
  ![Epidemic model.](/assets/images/five.png)

  The app uses Euler's method to solve a system of 400 nonlinear differential equations, displays an animation describing the results, and uses ReactJS to update the animation in real time as the equations are being solved (thus minimizing user wait time). The user interface also includes some information and links explaining the science behind the model. 

  ## Table of Contents

  * [Deployment](#deployment)

  * [Functionality](#functionality)
  
  * [Classical Mode](#classical)

  * [Contact](#contact)

  * [License](#license)

  ## Deployment

  A link to the deployed application can be found [here](https://sthompsonchicago.github.io/pandemic-simulator/). 

  ## Functionality

  The user interface includes "Run", "Stop" and "Reset" buttons which allow the user to control the simulation. 

  ![User interface.](/assets/images/one.png)

  After clicking the "Run" button, the simulation will begin, and the results will display as an animation in the "Infection Distribution" chart. Redder squares indicate locations with a higher percentage of infected people. 

  ![A simulation of the model.](/assets/images/two.png) 

  The user can control the results by changing different inputs: the effective transmission rate, the recovery rate, the population distribution function and the outbreak location. 

  ![User options.](/assets/images/three.png) 

  At the bottom of the page, there is additional information about the science behind the model. 

  ![More information about the model.](/assets/images/four.png) 

  ## Classical Mode

  This application also features a "classical mode", in which the population density is the same everywhere, and human mobility is described by a simple diffusion process. This version of the model is based on frameworks that epidemiologists used more in the past, but still are used in some applications today. In classical mode, the simulation displays traveling waves similar to those sometimes observed in chemical reaction-diffusion systems. 

  ![A traveling wave solution to the model.](/assets/images/seven.png)

  ## Questions

  My GitHub profile can be found [here](https://github.com/SThompsonChicago). You can contact me via email at s31@umbc.edu.

  ## License

    https://opensource.org/licenses/MIT
