'use client'

import React, { useState } from 'react'
import { Button, Modal, Menu, Tooltip } from 'react-daisyui'
import { Icons } from '@/common/icons'
import { ThemePanel } from './ThemePanel'
import { SettingDialog } from './SettingDialog'

export const FloatingMenu: React.FC = (
    props: React.ComponentProps<'div'> | { className: string },
) => {
    const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false)
    const { Dialog: ThemeDialog, handleShow: themeHandleShow } =
        Modal.useDialog()

    return (
        <div
            className='fixed bottom-4 right-4 flex flex-col space-y-2'
            {...props}
        >
            <Menu horizontal className='rounded-box bg-base-200 p-2'>
                <Menu.Item>
                    <Tooltip
                        message='Settings'
                        position='top'
                        onClick={() => setIsSettingDialogOpen(true)}
                    >
                        <Icons.Settings className='h-5 w-5' />
                    </Tooltip>
                </Menu.Item>
                <Menu.Item>
                    <Tooltip
                        message='Theme'
                        position='top'
                        onClick={themeHandleShow}
                    >
                        <Icons.Theme className='h-5 w-5' />
                    </Tooltip>
                </Menu.Item>
            </Menu>

            <SettingDialog
                isOpen={isSettingDialogOpen}
                onClose={() => setIsSettingDialogOpen(false)}
            />

            <ThemeDialog backdrop={true} className='max-w-5xl w-2/5'>
                <Modal.Header>
                    Theme
                    <form method='dialog' className='inline-block float-end'>
                        <Button
                            size='sm'
                            color='ghost'
                            shape='circle'
                            className='float-end'
                        >
                            x
                        </Button>
                    </form>
                </Modal.Header>
                <Modal.Body>
                    <ThemePanel />
                </Modal.Body>
                <Modal.Actions>
                    <form method='dialog'>
                        <Button>Close</Button>
                    </form>
                </Modal.Actions>
            </ThemeDialog>
        </div>
    )
}
