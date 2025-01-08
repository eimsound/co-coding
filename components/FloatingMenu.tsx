'use client'

import React, { useState } from 'react'
import { Button, Modal } from 'react-daisyui'
import SettingPanel from './SettingPanel'
// import ChangeThemePanel from './ChangeThemePanel';
import { Icons } from '@/common/icons'
import { ThemePanel } from './ThemePanel'

export const FloatingMenu: React.FC = (
    props: React.ComponentProps<'div'> | { className: string },
) => {
    // const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    // const [isThemeOpen, setIsThemeOpen] = useState(false)
    const { Dialog: SettingDialog, handleShow: settingHandleShow } =
        Modal.useDialog()
    const { Dialog: ThemeDialog, handleShow: themeHandleShow } =
        Modal.useDialog()
    // const { ,  } = Modal.useDialog()

    return (
        <div
            className="fixed bottom-4 right-4 flex flex-col space-y-2"
            {...props}
        >
            <Button onClick={settingHandleShow} className="btn btn-primary">
                <Icons.Settings className="h-5 w-5" />
            </Button>

            <SettingDialog>
                <Modal.Header>设置</Modal.Header>
                <Modal.Body>
                    <SettingPanel />
                </Modal.Body>
                <Modal.Actions>
                    <form method="dialog">
                        <Button>Close</Button>
                    </form>
                </Modal.Actions>
            </SettingDialog>

            <Button onClick={themeHandleShow} className="btn btn-primary">
                <Icons.Settings className="h-5 w-5" />
            </Button>

            <ThemeDialog backdrop={true}>
                <Modal.Header>设置</Modal.Header>
                <Modal.Body>
                    <ThemePanel />
                </Modal.Body>
                <Modal.Actions>
                    <form method="dialog">
                        <Button>Close</Button>
                    </form>
                </Modal.Actions>
            </ThemeDialog>
        </div>
    )
}
