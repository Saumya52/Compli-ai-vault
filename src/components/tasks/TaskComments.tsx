import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Reply, 
  ThumbsUp, 
  MoreVertical,
  User,
  Clock,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format, formatDistanceToNow } from "date-fns";

export interface TaskComment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: Date;
  isEdited?: boolean;
  replies?: TaskComment[];
  likes?: number;
  isLiked?: boolean;
}

interface TaskCommentsProps {
  taskId: string;
  comments: TaskComment[];
  isLoading: boolean;
  onAddComment: (comment: string) => void;
  onLoadComments: () => void;
}

export const TaskComments = ({ 
  taskId, 
  comments, 
  isLoading, 
  onAddComment, 
  onLoadComments 
}: TaskCommentsProps) => {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load comments when component mounts
  React.useEffect(() => {
    onLoadComments();
  }, []);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    await onAddComment(newComment);
    setNewComment("");
    setIsSubmitting(false);
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const CommentItem = ({ comment }: { comment: TaskComment }) => (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs">
            {getAuthorInitials(comment.userName)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{comment.userName}</span>
            <span className="text-muted-foreground">
              {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
            </span>
            {comment.isEdited && (
              <Badge variant="outline" className="text-xs">edited</Badge>
            )}
          </div>
          
          <div className="text-sm">
            {comment.content}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        </div>
      ) : comments.length > 0 ? (
        <ScrollArea className="h-64">
          <div className="space-y-4 pr-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No comments yet</p>
          <p className="text-xs">Start a conversation about this task</p>
        </div>
      )}
      
      <Separator />
      
      {/* Add Comment */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs">
              {getAuthorInitials(User?.name || "User")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-20 text-sm"
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                💡 Tip: Use @mention to notify team members
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNewComment("")}
                  disabled={!newComment.trim()}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 mr-1" />
                      Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};