#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE.md file in the project root for full license information.
#

from os import linesep
from sys import argv
from typing import Optional
from . import helper

# This should not change unless the Speech REST API changes.
PARTIAL_SPEECH_ENDPOINT = ".api.cognitive.microsoft.com";

def get_cmd_option(option : str) -> Optional[str] :
    argc = len(argv)
    if option.lower() in list(map(lambda arg: arg.lower(), argv)) :
        index = argv.index(option)
        if index < argc - 1 :
            # We found the option (for example, "--output"), so advance from that to the value (for example, "filename").
            return argv[index + 1]
        else :
            return None
    else :
        return None

def cmd_option_exists(option : str) -> bool :
    return option.lower() in list(map(lambda arg : arg.lower(), argv))

def user_config_from_args(usage : str) -> helper.Read_Only_Dict :

    subscription_key = get_cmd_option("--key")
    if subscription_key is None:
        raise RuntimeError(f"Missing Speech subscription key. Ai key is required.{linesep}{usage}")
    
    speech_region = get_cmd_option("--speechRegion")
    if speech_region is None:
        raise RuntimeError(f"Missing Speech region. Speech region is required.{linesep}{usage}")
    
    language_endpoint = get_cmd_option("--languageEndpoint")
    if language_endpoint is None:
        raise RuntimeError(f"Missing Language endpoint.{linesep}{usage}")
    language_endpoint = language_endpoint.replace("https://", "")

    language = get_cmd_option("--language")
    if language is None:
        language = "en"
    
    locale = get_cmd_option("--locale")
    if locale is None:
        locale = "en-US"
    
    input_audio_url = get_cmd_option("--input")
    if input_audio_url is None:
        raise RuntimeError(f"Please specify --input.{linesep}{usage}")

    return helper.Read_Only_Dict({
        "subscription_key" : subscription_key,
        "speech_endpoint" : f"{speech_region}{PARTIAL_SPEECH_ENDPOINT}",
        "language_endpoint" : language_endpoint,
        "language" : language,
        "locale" : locale,
        "input_audio_url" : input_audio_url,
        "output_file_path" : get_cmd_option("--output"),
        "use_stereo_audio" : cmd_option_exists("--stereo"),
    })
