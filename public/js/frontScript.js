// frontScript.js

document.addEventListener('DOMContentLoaded', () => {
    const accountWizard = document.getElementById('accountWizard');
    const signUpWizard = document.getElementById('signUpWizard');
    const signInWizard = document.getElementById('signInWizard');
    const signUpBtn = document.getElementById('signUpBtn');
    const signInBtn = document.getElementById('signInBtn');
    const backBtn = document.getElementById('backBtn');

    signUpBtn.addEventListener('click', function(){
        accountWizard.style.opacity = '0';
        accountWizard.style.transform = 'translateX(-50%)';
        accountWizard.style.pointerEvents = 'none';

        signUpWizard.style.display = 'flex';
        signUpWizard.style.opacity = '1';
        signUpWizard.style.transform = 'translateX(0)';
        signUpWizard.style.pointerEvents = 'auto';
    });

    signInBtn.addEventListener('click', function(){
        accountWizard.style.opacity = '0';
        accountWizard.style.transform = 'translateX(-50%)';
        accountWizard.style.pointerEvents = 'none';

        signInWizard.style.display = 'flex';
        signInWizard.style.opacity = '1';
        signInWizard.style.transform = 'translateX(0)';
        signInWizard.style.pointerEvents = 'auto';
    });

    backBtn.addEventListener('click', function(){
        accountWizard.style.opacity = '1';
        accountWizard.style.transform = 'translateX(0)';
        accountWizard.style.pointerEvents = 'auto';

        signUpWizard.style.opacity = '0';
        signUpWizard.style.transform = 'translateX(50%)';
        signUpWizard.style.pointerEvents = 'none';
    });

});


