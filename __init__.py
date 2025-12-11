from .nodes import OnDemandLoraLoader, OnDemandUNETLoader, OnDemandCheckpointLoader, OnDemandVAELoader, OnDemandCLIPLoader, OnDemandGGUFLoader, OnDemandControlNetLoader, OnDemandDualCLIPLoader, OnDemandCLIPVisionLoader, OnDemandModelPatchLoader
from .lora_node import OnDemandCivitaiLikedLoraLoader

NODE_CLASS_MAPPINGS = {
    "OnDemandLoraLoader": OnDemandLoraLoader,
    "OnDemandUNETLoader": OnDemandUNETLoader,
    "OnDemandCheckpointLoader": OnDemandCheckpointLoader,
    "OnDemandVAELoader": OnDemandVAELoader,
    "OnDemandCLIPLoader": OnDemandCLIPLoader,
    "OnDemandDualCLIPLoader": OnDemandDualCLIPLoader,
    "OnDemandCLIPVisionLoader": OnDemandCLIPVisionLoader,
    "OnDemandGGUFLoader": OnDemandGGUFLoader,
    "OnDemandControlNetLoader": OnDemandControlNetLoader,
    "OnDemandCivitaiLikedLoraLoader": OnDemandCivitaiLikedLoraLoader,
    "OnDemandModelPatchLoader": OnDemandModelPatchLoader
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "OnDemandLoraLoader": "OnDemand Lora Loader",
    "OnDemandUNETLoader": "OnDemand UNET Loader",
    "OnDemandCheckpointLoader": "OnDemand Checkpoint Loader",
    "OnDemandVAELoader": "OnDemand VAE Loader",
    "OnDemandCLIPLoader": "OnDemand CLIP Loader",
    "OnDemandDualCLIPLoader": "OnDemand DualCLIP Loader",
    "OnDemandCLIPVisionLoader": "OnDemand CLIP Vision Loader",
    "OnDemandGGUFLoader": "OnDemand GGUF Loader",
    "OnDemandControlNetLoader": "OnDemand ControlNet Loader",
    "OnDemandCivitaiLikedLoraLoader": "OnDemand Civitai Liked Lora Loader",
    "OnDemandModelPatchLoader": "OnDemand Model Patch Loader"
}

WEB_DIRECTORY = "./js"

__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', "WEB_DIRECTORY"]

# Module metadata
__version__ = "1.0.16"
__author__ = "francarl"
__description__ = "A suite of nodes for on-demand loading of Diffusion Models, VAE, Clip and Loras in ComfyUI."
