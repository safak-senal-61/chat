"use client";

import { useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bug, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Trash2, 
  Copy,
  ChevronDown,
  ChevronUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Zap
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function DebugPanel() {
  const { 
    socket, 
    isConnected, 
    connectionError, 
    currentUser, 
    retryConnection, 
    connectionLogs,
    clearLogs 
  } = useSocket();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showFullLogs, setShowFullLogs] = useState(false);

  const copyLogsToClipboard = () => {
    const logsText = connectionLogs.join('\n');
    navigator.clipboard.writeText(logsText);
  };

  const testConnection = () => {
    if (socket && isConnected) {
      console.log('🧪 Test bağlantısı gönderiliyor...');
      socket.emit('join room', `test-room-${Date.now()}`);
      
      // Test ping
      const startTime = Date.now();
      socket.emit('ping', startTime, (response: any) => {
        const latency = Date.now() - startTime;
        console.log(`🏓 Ping response: ${latency}ms`, response);
      });
    }
  };

  const testWebRTC = () => {
    if (socket && isConnected) {
      console.log('🎥 WebRTC test başlatılıyor...');
      const testRoom = `webrtc-test-${Date.now()}`;
      socket.emit('join room', testRoom);
    }
  };

  const getConnectionStatus = () => {
    if (isConnected) {
      return { icon: CheckCircle, text: 'Bağlı', color: 'text-green-500', bg: 'bg-green-500/10' };
    } else if (connectionError) {
      return { icon: AlertCircle, text: 'Hata', color: 'text-red-500', bg: 'bg-red-500/10' };
    } else {
      return { icon: Clock, text: 'Bağlanıyor...', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    }
  };

  const status = getConnectionStatus();
  const StatusIcon = status.icon;

  const recentLogs = showFullLogs ? connectionLogs : connectionLogs.slice(-15);

  // Network info
  const getNetworkInfo = () => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 'unknown',
      rtt: connection?.rtt || 'unknown'
    };
  };

  const networkInfo = getNetworkInfo();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`mb-2 backdrop-blur ${status.bg} border-2`}
          >
            <Bug className="h-4 w-4 mr-2" />
            Debug Panel
            <StatusIcon className={`h-4 w-4 ml-2 ${status.color}`} />
            {isOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="w-[450px] max-h-[700px] bg-background/95 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Socket Debug & WebRTC Test
                </div>
                <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${status.bg}`}>
                  <StatusIcon className={`h-4 w-4 ${status.color}`} />
                  <span className={`text-xs font-medium ${status.color}`}>{status.text}</span>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Connection Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Bağlantı Bilgileri
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Socket ID:</span>
                    <div className="font-mono text-xs break-all">{socket?.id || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Transport:</span>
                    <div className="font-mono">{socket?.io?.engine?.transport?.name || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">User:</span>
                    <div className="font-mono">{currentUser?.username || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Protocol:</span>
                    <div className="font-mono">{socket?.protocol || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Network Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Network Status
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Online:</span>
                    <Badge variant={networkInfo.online ? "default" : "destructive"} className="ml-1 text-xs">
                      {networkInfo.online ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <div className="font-mono">{networkInfo.effectiveType}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Speed:</span>
                    <div className="font-mono">{networkInfo.downlink} Mbps</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">RTT:</span>
                    <div className="font-mono">{networkInfo.rtt} ms</div>
                  </div>
                </div>
              </div>

              {/* Backend Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Backend URL</h4>
                <div className="text-xs font-mono break-all bg-muted p-2 rounded">
                  {process.env.NEXT_PUBLIC_BACKEND_URL || 'https://3000-firebase-websachat-backend-1748272624869.cluster-6vyo4gb53jczovun3dxslzjahs.cloudworkstations.dev'}
                </div>
              </div>

              {/* Error Display */}
              {connectionError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  <div className="font-medium">Hata:</div>
                  <div className="mt-1 break-words">{connectionError}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={retryConnection}
                  disabled={isConnected}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={testConnection}
                  disabled={!isConnected}
                >
                  <Wifi className="h-3 w-3 mr-1" />
                  Test
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={testWebRTC}
                  disabled={!isConnected}
                >
                  <Activity className="h-3 w-3 mr-1" />
                  WebRTC
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={clearLogs}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>

              <Button 
                size="sm" 
                variant="outline" 
                onClick={copyLogsToClipboard}
                className="w-full"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy All Logs
              </Button>

              {/* Logs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">
                    Loglar ({connectionLogs.length})
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowFullLogs(!showFullLogs)}
                  >
                    {showFullLogs ? 'Son 15' : 'Tümü'}
                  </Button>
                </div>
                
                <ScrollArea className="h-64 w-full border rounded p-2">
                  <div className="space-y-1">
                    {recentLogs.length === 0 ? (
                      <div className="text-xs text-muted-foreground">Henüz log yok</div>
                    ) : (
                      recentLogs.map((log, index) => (
                        <div 
                          key={index} 
                          className="text-xs font-mono break-all leading-relaxed p-1 rounded hover:bg-muted/50"
                        >
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}