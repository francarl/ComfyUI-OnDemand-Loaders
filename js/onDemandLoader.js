import { app } from "/scripts/app.js";
import { api } from "/scripts/api.js";

async function onLoraChanged(node, lora_name) {
    try {
        const response = await api.fetchApi("/on_demand_loader/lora_changed", {
            method: "POST",
            body: JSON.stringify({ lora_name }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status !== 200) {
            console.error(`[OnDemandLoader] Failed to notify backend of lora change: ${response.status}`);
        } else {
			const loraInfo = await response.json();
			addOrUpdateLoraInfoWidgets(node, loraInfo);
		}
    } catch (e) {
        console.error("[OnDemandLoader] Failed to notify backend of lora change", e);
    }
}

function addOrUpdateLoraInfoWidgets(node, loraInfo) {
	if (loraInfo.author) {
		const authorWidget = node.widgets.find((w) => w.name === "author");
		if (!authorWidget) {
			node.addWidget("text",
				"author",
				loraInfo.author,
				null,
				{ serialize: false,
					read_only: true
				 }
			);
		} else {
			authorWidget.value = loraInfo.author;
		}
	}

	if (loraInfo.trigger_words) {
		const triggerWordsWidget = node.widgets.find((w) => w.name === "trigger_words");
		if (!triggerWordsWidget) {
			node.addWidget("text",
				"trigger_words",
				loraInfo.trigger_words.join(', '),
				null,
				{ serialize: false,
					read_only: true,
					multiline: true
				 }
			);
		} else {
			triggerWordsWidget.value = loraInfo.trigger_words.join(', ');
		}
	}
	/*                    					
	if (loraInfo.description) {
		const template = document.createElement('div');
		template.innerHTML = loraInfo.description;
		
		const descriptionWidget = node.widgets.find((w) => w.name === "lora_description_html");
		if (!descriptionWidget) {
			node.addDOMWidget("lora_description_html", 
				// loraInfo.description, 
				'customtext',
				template.firstElementChild, {
					hideOnZoom: false
				}
			);
		} else {
			descriptionWidget.inputEl = template.firstElementChild;
		}
	}
	*/

}


app.registerExtension({
	name: "comfy.francarl.onDemandLoader",
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		if (nodeData.name === "OnDemandCivitaiLikedLoraLoader") {
			const onNodeCreated = nodeType.prototype.onNodeCreated;
			nodeType.prototype.onNodeCreated = function () {
				onNodeCreated?.apply(this, arguments);

				const loraNameWidget = this.widgets.find((w) => w.name === "lora_name");

				if (loraNameWidget) {
					loraNameWidget.callback = (value) => {
						onLoraChanged(this, value);
					};
				}
				
				this.addWidget("button", "ℹ️ Lora Info", "", () => {
					window.showSelectedLoraInfo(this, loraNameWidget);
				}, { serialize: false });
				
			};
		}
	},
	async setup() {
        // This function will be called when the extension is loaded.
        // We define a global function that ComfyUI's _WEB_CONTROL_TYPES can call.
        window.showSelectedLoraInfo = async (node, widget) => {
            console.log("[OnDemandLoader] Show Selected LoRA Info button clicked!");

            try {
                const response = await fetch("/on_demand_loader/get_selected_lora_info");
                if (response.ok) {
                    const loraInfo = await response.json();
					addOrUpdateLoraInfoWidgets(node, loraInfo);
                } else {
                    const errorData = await response.json();
                    alert(`Error fetching LoRA info: ${errorData.error || response.statusText}`);
                }
            } catch (error) {
                console.error("[OnDemandLoader] Failed to fetch selected LoRA info:", error);
                alert("Failed to fetch selected LoRA info. Check console for details.");
            }
        };
    }
});