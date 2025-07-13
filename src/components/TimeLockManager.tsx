
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Lock, Unlock } from 'lucide-react';

interface TimeLockManagerProps {
  onTimeLockSet: (unlockTime: string, blockHeight?: number) => void;
  currentRecord?: {
    id: string;
    unlockTime?: string;
    blockHeight?: number;
  };
}

const TimeLockManager: React.FC<TimeLockManagerProps> = ({ onTimeLockSet, currentRecord }) => {
  const [unlockTime, setUnlockTime] = useState(currentRecord?.unlockTime || '');
  const [blockHeight, setBlockHeight] = useState(currentRecord?.blockHeight?.toString() || '');
  const [lockType, setLockType] = useState<'time' | 'block'>('time');

  const handleSetTimeLock = () => {
    if (lockType === 'time' && unlockTime) {
      onTimeLockSet(unlockTime);
    } else if (lockType === 'block' && blockHeight) {
      onTimeLockSet('', parseInt(blockHeight));
    }
  };

  const isLocked = () => {
    if (currentRecord?.unlockTime) {
      return new Date(currentRecord.unlockTime) > new Date();
    }
    return false;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isLocked() ? <Lock className="h-5 w-5 text-red-500" /> : <Unlock className="h-5 w-5 text-green-500" />}
          Time-Lock Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button
            variant={lockType === 'time' ? 'default' : 'outline'}
            onClick={() => setLockType('time')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Time-based
          </Button>
          <Button
            variant={lockType === 'block' ? 'default' : 'outline'}
            onClick={() => setLockType('block')}
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Block-based
          </Button>
        </div>

        {lockType === 'time' ? (
          <div className="space-y-2">
            <Label htmlFor="unlock-time">Unlock Date & Time</Label>
            <Input
              id="unlock-time"
              type="datetime-local"
              value={unlockTime}
              onChange={(e) => setUnlockTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="block-height">Unlock at Block Height</Label>
            <Input
              id="block-height"
              type="number"
              value={blockHeight}
              onChange={(e) => setBlockHeight(e.target.value)}
              placeholder="Enter block number"
            />
          </div>
        )}

        <Button onClick={handleSetTimeLock} className="w-full">
          Set Time Lock
        </Button>

        {currentRecord && isLocked() && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This record is locked until: {new Date(currentRecord.unlockTime!).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeLockManager;
