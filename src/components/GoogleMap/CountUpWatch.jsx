import React, { useState,useEffect } from 'react';



// Basic functional component structure for React with default state
// value setup. When making a new component be sure to replace the
// component name TemplateFunction with the name for the new component.
function CountUpWatch() {
  // Using hooks we're creating local state for a "heading" variable with
  // a default value of 'Functional Component'
  const [initialTime,] = useState(Date.now());
  const [currentTime,setCurrentTime] = useState(Date.now());
  

useEffect(()=>{
    const interval = setInterval(() => {
        setCurrentTime(Date.now())
      }, 1000); 
  
      return () => {
        clearInterval(interval);
      }; 
},[]);

  return (
      <h2>{(((currentTime-initialTime)/1000)+1).toFixed()}</h2>
  );
}

export default CountUpWatch;
