# Epidemic Simulator


  ## Description

  This web application makes it possible to visualize the way contagious diseases spread, and to better understand how policy interventions can stop epidemics. It relies on a modern epidemiological model, and the user has options to vary different inputs (the effective transmission rate, the recovery rate, the population distribution, the outbreak location and the mobility type). Some inputs will lead to rapid infection propagation, while others will cause the disease to die out. Although the model is relatively simple, it reproduces important qualitative features of real-world epidemics and makes it possible to understand the logic behind more sophisticated models. 
  
  ![Epidemic model.](/assets/images/top.png)

  The app uses Euler's method to solve a system of 400 nonlinear differential equations, displays an animation describing the results, and uses ReactJS to update the animation in real time as the equations are being solved (thus minimizing user wait time). The user interface also includes some information and links explaining the science behind the model. 

  ## Table of Contents

  * [Deployment](#deployment)

  * [Functionality](#functionality)
  
  * [Basic Reproduction Number](#basic-reproduction-number)

  * [Population Distribution Function](#population-distribution-function)
  
  * [Classical Mode](#classical-mode)

  * [Contact](#contact)

  * [License](#license)

  ### Deployment

  A link to the deployed application can be found [here](https://sthompsonchicago.github.io/pandemic-simulator/). 

  ### Functionality

  The user interface includes "Run", "Stop" and "Reset" buttons which allow the user to control the simulation. After clicking the "Run" button, the simulation will begin, and the results will display as an animation in the "Infection Distribution" chart. Redder squares indicate locations with a higher percentage of infected people. 

  ![A simulation of the model.](/assets/images/two.png) 

  The user can control the results by changing different inputs: the effective transmission rate, the recovery rate, the population distribution function, the outbreak location and the mobility type. 

  ![User options.](/assets/images/three.png) 

  At the bottom of the page, there is additional information about the science behind the model. 

  ![More information about the model.](/assets/images/four.png) 

  ### Basic Reproduction Number

  The basic reproduction number, also sometimes referred to as R_0, is the ratio of the effective transmission rate to the recovery rate. Thus, the user can change the basic reproduction number by varying these two model parameters. The current value is displayed on the user interface. One can verify by experimenting with different parameter values that the disease will die out if the basic reproduction number is less than one, as the science predicts. 
  
  Here is an example. Click "Reset", set the parameters at their default values (so the effective transmission rate is 7 and the recovery rate is 0.4), choose a random outbreak location, click "Run", and let the simulation go for 60 or so "days". Then click "Stop". Depending on the outbreak location, the result might look something like this:
  
  ![An example simulation.](/assets/images/Ex1.png) 
  
  Next, suppose some policy interventions (i.e., social distancing, better medical care, etc) are able to lower the effective transmission rate to 1 and increase the recovery rate to 2. Once these parameters are changed in the model, the new basic reproduction number will display: it will be 1/2. If we then resume the simulation by clicking "Run", we see that the epidemic gradually disappears, as in the image below. 
  
  ![Policy interventions gradually bring the epidemic to an end.](/assets/images/Ex2.png) 

  ### Population Distribution Function

  In this model, people travel to high-population-density areas more frequently than low-population areas. As a result, there is a tendency for epidemics to spread to cities relatively quickly, even if they are far away from the initial outbreak. Therefore, the population distribution function is a key input for the model, and affects the spreading pattern. The user can choose a random population distribution function and see how this changes the results. 

  ![A simulation with a random population distribution function.](/assets/images/pop.png)

  ### Classical Mode

  This application also features a "classical mode", in which the population density is the same everywhere, and human mobility is described by a simple diffusion process. Models like this were more commonly used in the past, but are also still utilized in some applications today. In classical mode, the simulation displays traveling waves similar to those sometimes observed in chemical reaction-diffusion systems. 

  ![A traveling wave solution to the model.](/assets/images/seven.png)

  ### Questions

  My GitHub profile can be found [here](https://github.com/SThompsonChicago). You can contact me via email at s31@umbc.edu.

  ### License

    https://opensource.org/licenses/MIT
