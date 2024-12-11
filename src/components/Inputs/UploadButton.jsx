import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import yaml from 'js-yaml';
import UploadedAtomicSelection from './UploadedAtomicSelection';
import transformInputArguments from './transformInputArguments';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


export default function UploadButton({ setChanged, changed, base, darkMode, setInputs, setErrorMessage }) {
    const [open, setOpen] = React.useState(false);
    const [atomicNames, setAtomicNames] = React.useState([]);
    const [techniqueName, setTechniqueName] = React.useState(null);
    const [techniqueId, setTechniqueId] = React.useState(null);
    const [fileContent, setFileContent] = React.useState(null);

    const handleFileUpload = async (event) => {
        if (changed) {
            const confirm = window.confirm('Are you sure you want to load another test? Your current inputs will be overwritten.');
            if (!confirm) return;
        }
        const file = event.target.files[0];
        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (fileExtension !== "yaml" && fileExtension !== "yml") {
                setErrorMessage("Only yaml files can be uploaded.");
                console.error("Only yaml files can be uploaded.");
                return;
            }
            try {
                const content = await file.text();

                const parsed = yaml.load(content);
                setFileContent(parsed);
                if (parsed.atomic_tests && typeof parsed.atomic_tests === 'object') {
                    setAtomicNames(parsed.atomic_tests.map(i => i.name))
                    setTechniqueName(parsed.display_name);
                    setTechniqueId(parsed.attack_technique);
                    setOpen(true);
                } else {
                    setInputs({ ...base, ...transformInputArguments(parsed[0]) });
                }

            } catch (error) {
                console.error("Error while file processing the yaml file, check format.", error);
                setErrorMessage("Error while file processing the yaml file, check format.");
            } finally {
                event.target.value = null;
                setChanged(false); // // // // //
            }
        }
    };
    return (

        <Button
            component="label"
            role={undefined}
            variant={darkMode ? "outlined" : "contained"}
            tabIndex={-1}
        >
            Upload YAML
            <VisuallyHiddenInput
                type="file"
                onChange={handleFileUpload}
                multiple
            />
            {
                open &&
                <UploadedAtomicSelection
                    base={base}
                    atomicNames={atomicNames}
                    techniqueName={techniqueName}
                    techniqueId={techniqueId}
                    open={open}
                    setOpen={setOpen}
                    fileContent={fileContent}
                    setInputs={setInputs}
                />
            }
        </Button>
    );
}
