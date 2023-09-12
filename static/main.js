let jsonData;

document.addEventListener('alpine:init', async () => {
    console.log('Alpine initialized')

    Alpine.store('configPanel', {
        open: false,
        selectedButton: undefined,
        buttonData: undefined,
        modButtonData: undefined,
        parsedButtonData: undefined,

        toggle() {
            this.open = !this.open
        },

        openPanel(selectedButton) {
            console.log('openPanel', selectedButton)
            this.selectedButton = selectedButton;
            this.filterButtonDataGetButtonTree(selectedButton);
            console.log('buttonData', this.parsedButtonData);
            this.open = true;
        },

        filterButtonDataGetButtonTree(buttonValue) {
            const button = Alpine.store('configInfo').data.buttons.find(btn => btn.gpio.value === buttonValue);

            if (!button) {
                return null; // Button not found
            }
            // TODO This needs to be dynamic
            this.buttonData = button;
            this.modButtonData = button;

            this.parsedButtonData = JSON.stringify(this.buttonData, null, 2);
        },

        addRequest() {
            const button = Alpine.store('configPanel').modButtonData;
            console.log(button);

            let buttonToAddRequest = this.modButtonData.requests.value;
            buttonToAddRequest.push({
                method: 'GET', url: '', args: {
                    data: {}, params: {}, json: {}, headers: {}
                }
            });
            console.log(button);
        },

        removeRequest(index) {
            const button = Alpine.store('configPanel').modButtonData;
            console.log(button);

            let buttonToAddRequest = this.modButtonData.requests.value;
            buttonToAddRequest.splice(index, 1);
            console.log(button);
        }
    });
    Alpine.store('configInfo', {
        data: {},

        fetchConfigData() {
            fetch('/config')
                .then(response => response.json())
                .then(configData => {
                    console.log(configData);
                    this.data = configData;
                    jsonData = configData;
                    window.config = configData;
                });
        }
    });
    Alpine.store('configInfo').fetchConfigData();


    //TODO Add sanity check
    //TODO Add export method to configInfo
    //TODO Add confirmation dialog
})


function generateFormFromJson(jsonData) {
    function processProperty(prop) {
        if (typeof prop === 'string' || typeof prop === 'number' || typeof prop === 'boolean') {
            return {
                type: typeof prop, value: prop
            };
        } else if (Array.isArray(prop)) {
            return {
                type: 'array', items: prop.map(processProperty)
            };
        } else if (typeof prop === 'object') {
            const properties = [];
            for (const key in prop) {
                if (prop.hasOwnProperty(key)) {
                    properties.push({
                        label: key, value: processProperty(prop[key]), type: 'object'
                    });
                }
            }
            return {
                type: 'object', properties
            };
        }
    }

    return processProperty(jsonData);
}

