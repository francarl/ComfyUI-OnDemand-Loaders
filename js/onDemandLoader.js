import { app } from "/scripts/app.js";
import { api } from "/scripts/api.js";
import { ComfyWidgets } from "/scripts/widgets.js";
import { SearchableCombo } from "./SearchableCombo.js";

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
            console.error(`[ComfyUI-OnDemand-Loaders] Failed to notify backend of lora change: ${response.status}`);
        } else {
			const loraInfo = await response.json();
			addOrUpdateLoraInfoWidgets(node, loraInfo);
		}
    } catch (e) {
        console.error("[ComfyUI-OnDemand-Loaders] Failed to notify backend of lora change", e);
    }
}

function addOrUpdateLoraInfoWidgets(node, loraInfo) {
	if (loraInfo.name !== "None") {

		if (loraInfo.author) {
			addOrUpdateWidget(node, "author", loraInfo.author);
		}

		if (loraInfo.trigger_words && loraInfo.trigger_words.length > 0) {
			addOrUpdateWidget(node, "trigger_words", loraInfo.trigger_words.join(', '), "STRING", true);
		}

		if (loraInfo.id) {
			const urlValue = `[Civitai Model URL](https://civitai.com/models/${loraInfo.id})`;
			addOrUpdateWidget(node, "url", urlValue, "MARKDOWN", false);
		}

		if (loraInfo.base_model) {
			addOrUpdateWidget(node, "base_model", loraInfo.base_model);
		}
	} else {
		hideWidgetIfExists(node, "author");
		hideWidgetIfExists(node, "trigger_words");
		hideWidgetIfExists(node, "url");
		hideWidgetIfExists(node, "base_model");
	}
	node.computeSize();
}

function hideWidgetIfExists(node, widgetName) {
	const w = node.widgets.find((w) => w.name === widgetName);
	if (w) {
		w.hidden = true;
	}
}

function addOrUpdateWidget(node, widgetName, value, type = "STRING", multiline = false) {
	const w = node.widgets.find((w) => w.name === widgetName);
	if (!w) {
		const newW = ComfyWidgets[type](node, widgetName, ["STRING", { multiline: multiline }], app).widget;
		if (newW.inputEl) {
			newW.inputEl.readOnly = true;
			newW.inputEl.style.opacity = 0.8;
		}
		newW.value = value;
	} else {
		w.value = value
		w.hidden = false;
	}
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

					loraNameWidget.searchableCombo = new SearchableCombo();

					loraNameWidget.onClick = (e) => {
						console.log("[ComfyUI-OnDemand-Loaders] Lora Name:", loraNameWidget.value);

						loraNameWidget.searchableCombo.show(loraNameWidget.options.values, {
							event: e,
							title: 'Select Preset',
							currentMode: 'list',
							initialExpanded: false,
							onExpandedChange: (isExpanded) => {
								console.log('[ComfyUI-OnDemand-Loaders] SearchableCombo expanded:', isExpanded);
							},
							callback: (selectedItem) => {
								loraNameWidget.value = selectedItem;
								onLoraChanged(this, selectedItem);
							}
						});
					};
				}
				
				this.addWidget("button", "ℹ️ Lora Info", "", () => {
					window.showSelectedLoraInfo(this, loraNameWidget);
				}, { serialize: false });
				
			};
		}
	},
	async setup() {
        window.showSelectedLoraInfo = async (node, widget) => {
            onLoraChanged(node, widget.value);
        };
    }
});