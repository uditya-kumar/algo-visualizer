'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Play } from 'lucide-react';

interface CodeInputProps {
  onSubmit: (code: string) => void;
  loading?: boolean;
}

const DEFAULT_CODE = `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Example: two_sum([2, 7, 11, 15], 9) -> [0, 1]`;

export function CodeInput({ onSubmit, loading }: CodeInputProps) {
  const [code, setCode] = useState(DEFAULT_CODE);

  const handleSubmit = () => {
    if (code.trim() && !loading) {
      onSubmit(code);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Python Code</CardTitle>
          <Button
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Visualize
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        <div className="h-full border rounded-md overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="python"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              wordWrap: 'on',
              padding: { top: 12, bottom: 12 },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
