import { useState, useEffect, useCallback } from 'react';
import { Command } from 'cmdk';

const CommandMenu = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Command.Input placeholder="Type a command or search..." />
      <Command.List>
        <Command.Group heading="Navigation">
          <Command.Item onSelect={() => runCommand(() => window.location.href = '/')}>
            Home
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => window.location.href = '/experience')}>
            Experience
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => window.location.href = '/projects')}>
            Projects
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
};

export default CommandMenu;
