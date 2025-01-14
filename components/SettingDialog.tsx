import React from 'react'
import { Modal, Button } from 'react-daisyui'
import SettingPanel from './SettingPanel'

interface SettingDialogProps {
    isOpen: boolean
    onClose: () => void
}

export const SettingDialog: React.FC<SettingDialogProps> = ({
    isOpen,
    onClose,
}) => {
    return (
        <Modal open={isOpen} onClose={onClose} backdrop={true}>
            <Modal.Header>
                Settings
                <form method="dialog" className="inline-block float-end">
                    <Button
                        size="sm"
                        color="ghost"
                        shape="circle"
                        className="float-end"
                        onClick={onClose}
                    >
                        x
                    </Button>
                </form>
            </Modal.Header>
            <Modal.Body>
                <SettingPanel />
            </Modal.Body>
            <Modal.Actions>
                <form method="dialog">
                    <Button onClick={onClose}>Close</Button>
                </form>
            </Modal.Actions>
        </Modal>
    )
}
