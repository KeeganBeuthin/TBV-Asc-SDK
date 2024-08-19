async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
      logMessage(ptr, len) {
        // src/ffi/logMessage(usize, i32) => void
        ptr = ptr >>> 0;
        logMessage(ptr, len);
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    execute_credit_leg(amountPtr, accountPtr) {
      // src/transactions/execute_credit_leg(usize, usize) => usize
      return exports.execute_credit_leg(amountPtr, accountPtr) >>> 0;
    },
    process_credit_result(resultPtr) {
      // src/transactions/process_credit_result(usize) => usize
      return exports.process_credit_result(resultPtr) >>> 0;
    },
    execute_debit_leg(amountPtr, accountPtr) {
      // src/transactions/execute_debit_leg(usize, usize) => usize
      return exports.execute_debit_leg(amountPtr, accountPtr) >>> 0;
    },
    allocateString(len) {
      // src/memory/allocateString(i32) => usize
      return exports.allocateString(len) >>> 0;
    },
    writeString(ptr, str) {
      // src/memory/writeString(usize, ~lib/string/String) => void
      str = __lowerString(str) || __notnull();
      exports.writeString(ptr, str);
    },
    readString(ptr) {
      // src/memory/readString(usize) => ~lib/string/String
      return __liftString(exports.readString(ptr) >>> 0);
    },
  }, exports);
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  function __lowerString(value) {
    if (value == null) return 0;
    const
      length = value.length,
      pointer = exports.__new(length << 1, 2) >>> 0,
      memoryU16 = new Uint16Array(memory.buffer);
    for (let i = 0; i < length; ++i) memoryU16[(pointer >>> 1) + i] = value.charCodeAt(i);
    return pointer;
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  return adaptedExports;
}
export const {
  memory,
  execute_credit_leg,
  process_credit_result,
  execute_debit_leg,
  allocateString,
  writeString,
  readString,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("release.wasm", import.meta.url));
A�I  AvA�r A?qA�rAtr;  Aj A��I  Aj Iq A��qA��Fq@  /"A��qA��F@  A�qA
tA��j A�qr"A?qA�rAt AvA?qA�rAtr AvA?qA�rAtr AvA�rr6  Aj!  Aj!   AvA�r AvA?qA�rAtr;   A?qA�r:  Aj!  Aj! c E@  E@A A�
A�A  # Ak"(AqF@  Ak" (Aq"#EF@    	#AF AFq@ 	    Atj 6    A    6    A 5A!A!@  @  l   Aq!  Av!   l! �  A�J|  D      ��!  A�k"A�J|A� A�k" A�N!  D      ��   A�xH|  D      `�!  A�j"A�xH|A�x A�j" A�xL!  D      `�     �B�|B4����~   }!BA  k"��"	B}" �!
  ���"!@ A J@@@@@@@@@@@@@ Ak
	 
 A����n! A����p!
 A���/n! A���/p!	 A���n! A���p! A��=n! A��=p! A��n! A��p! A�� n! A�� p! A�n! A�p! A� n! A� p! A
n! A
p! !A !A !  r@ "Aj! AtA� j A��qA0j;  Ak!  � �� 
|" Z@# j$ AtA�'j5  ��!	 AtA� j"/ !@   T   } 	Zq    	|"V   }  }VrA @ Ak!   	|!   ;  @ B
~! 
B
~" ��"  ��B R@ "Aj! AtA� j  �A��qA0j;  Ak!  �"
 Z # j$ A  kAtA�'j5 ~! AtA� j"/ !@  
V  
} 	Zq  	 
|" V  
}   }VrA @ Ak! 	 
|!
  ;  � E@   AtjA���6  Aj  j"AL  Lq@  H@   AtjA0;  Aj!   AtjA���6  Aj AL A Jq   Atj" Aj  A  kAt�
    A.;  Aj A L AzJq  A k"Atj   At�
    A���6 A!@  H@   AtjA0;  Aj!  j AF@  A� ; Ak"A H"@A  k!  Aj  Aj"  A-A+ ;  Aj  Aj At"Ak�
    A.;   j"A� ; Ak" A H"@A   k!  Aj    Aj"  A-A+ ;   j! Aj�
~  D        c"|A� A-;   �  �"B��������� �B4��"A A�k"Ak B�������� A G�B4�|"B�B|"y�"k!  ��$  B�������QAj"��B}  k k��$ $A�AC#k�D�y�PD�?�D     �u@�" �" �  bjAuAj"At"k$ A� j) $ AtA�&j. $  y�"B�����!#"B�����" B �"~  ~B �|!#"B�����! B �" ~  ~B �|!#"	B�����!
 	B �"	 ~  
~B �|! AtA� j  B �"~ B �|  ~ B�����|B����|B �|  ~ B �|  ~ B�����|B����|B �|B}"##jA@k   	~ B �|  
~ B�����|B����|B �|B|}  k# j8  @  Ak"(AqAF@A�*A�
A�A    #A  C   E@  Ak" (AqAG@A�*A�
A�A  #AF@  	    #	#9 #A J@@#@@#@#�B�~B� ��A�j$i@@@@@@  Ak(      Ak(j!@   I@  ( "@ 
  Aj!    ( " @  
& ? AtA��kAv$A�
$A�$A�$	 #A�+H@A��A�AA  |#Ak$$#B 7 #  6   Ak(A~q!# 6 @ Ak(A~q" j"E@A�!# A"6    �
    j  �
  #Aj$ �#Ak$$#A 6 @@#Ak  #  6 #Ak$$#B 7 #  6   "Ak( j!@  I@ / "A�I Aj A�I Aj A��qA��F Aj Iq@ /A��qA��F@ Aj! Aj! Aj! Aj!# A"6#  6     Ak(Av #Aj$#Aj$ B #Ak$$#B 7 #  6 A$#  &" 6#  6     Ak(#Aj$B #Ak$$#B 7 #  6 #A 6#Ak$$#B 7 #Aj$#Aj$  EE1 #Ak$$#B 7 #  6 # 6   %! #Aj$  �#Ak$$#A A� @ Ak"A H@A�!  E@#  ( " 6 #  6  (@#  6A�! A�!#A�6#A�6A�( Av!@  J@#   Atj( "6 # 6 (@# 6# 6# 6#  )"6 @# 6#A�6# A�)"6 Aj!#   Atj( " 6 #  6  (@# 6#  6#  6#   )"6 ! #Aj$  A#Ak$$#B 7 #  6  Ak(Av!#A�6    *! #Aj$  �#Ak$$#A A� #A�6  !# 6A� %!# 6  '@   j-  @ Aj!#  " 6# :"6#A�6#  6A�A  #A�6# 6A�A #A�6#A�6A�+! #  6   '#Aj$ �#Ak$$#B 7 #B 7  E@#AA" 6 #  6  A #  6  A 6#  6  A 6 A����K@A�A�AA9  # A"6#  6# 6   #  6   6#  6   6#Aj$  �#Ak$$#B 7 #A 6  ,!#!#Ak$$#B 7 #AA"6 # 6#  -"6 #Aj$  6 @  H@# 6   j-  !#Ak$$#A 6 # 6   (O@A�A�A�A-  # 6  ( j :  #Aj$ Aj!# 6# ( " 6#Ak$$#A 6 #  6     Ak(;! #Aj$#Aj$  �~|#Ak$$#A 6 #  6 |@@  Ak(Av"E   / !D      �?!@  A�rA�F A	kAMr A�-I A A�@jA
M A A�-F A�� Fr A�� F A�� Frr A�� F A�� Fr A��Frr A A @  Aj" / ! Ak! E  A-F Ak"ED      �!  Aj" /  A+F Ak"E  Aj" /  "A� F ANq@ D      ��  ) Bɀ�����4Q  )B����<QA  A.G A0kA
Oq   !@ A0F@  Aj" / ! Ak! A L A.F@   F!  Aj!   Ak"EqA!@  / "A0F@ Ak! Ak!  Aj!  A L  Eq A0kA
Oq A0k!@ E A.Fq A
I"r@@ @ � B
~|  EE�� AH! Aj! !A! Ak"E   Aj" / "A0k!   A  AJk!@ PA!A   / A rA� G A  Ak"E   Aj" / "A-FA  Ak"EA!  Aj" /  A+FA  Ak"E  Aj" /  !@ A0F@A  Ak"E  Aj" / ! A0k!@ A
IA  @ A�l A�N A
l j! Ak!  Aj" / A0k!  l j" A�}Hr D      �!  A�J  �!  E   A%L  AJq@   AtA�j+ �!A!  B�������X  Au"   jsALA |  A J@   AtA�j+ �! A   kAtA�j+ �  A H|  y"	�!  � 	}!	@  ArL@ B郱�� B郱��"y"
B}��D�+����?���  
�|! 	 
}!	  Aj!  A   k�"
�"y!  
��� B4�|� 
���  �|� 	 }�  z"	�! 	  �|$@  AN@B  B �B���~ B�����B���~"B �|"	B ��g"�}"
#|$  ��B�B� 	 �� B����� 
��|!  Ak!   " � B�����~!	B   � B �~ 	B �|"B ��g" �}"
#|$ 	  ��B�B�   �� 	B����� 
��|�#�!  �D      � D        �!#Aj$ H|#Ak$$#A 6 #  6 #Ak$$#A 6 #  6   /!#Aj$#Aj$ �#Ak$$#A A� #A�6  :!# 6A� %!# 6  '  AAj!# "6#  :" 6#A�6# 6A�A #A�6#  6A�A  #A�6#A�6A�+! #  6   '#Aj$ F #Ak$$#B 7 # 6 A$# &"6# 6     Ak(�
  #Aj$�#A$k$$#A A$� #  ."6 # ."6# 6# 6#A�6# 6A�A #A�6# 6A�A #A�6#A�6A�+! #  6  '# 6 0$ #! # 6#A�6# 6A�A #A�6#A�6  A�+" 6 #  6  Ak(Av1!#  6   2#A$j$ �#Ak$$#B 7 # 6 @ Ak(Av"E@A !#  6   Ak(Av"@ A  A J"   H!  k!@  L@#  6 # 6   Atj"Aq "AqrE "AOq@@ )  ) Q@ Aj! Aj! Ak"AO@ "Ak! @ / " / "	G@  	k Aj! Aj!A E Aj!A!#Aj$ U #Ak$$#B 7 #A 6#A�6 #  6#A�  %" 6#  6   Ak(Av1! #Aj$  �#Ak$$#B 7 #  6  A  A J"  Ak(Av"  J" A  A J"   J"  JAt!@    HAt" k"E@A�!  E  AtFq # A"6    j �
   ! #Aj$  1 #Ak$$#A 6 #  6   Ak(Av1! #Aj$  �|#A$k$$#A A$� #  ." 6 #A�6#  6A�  %!# 6 '#  6#A�6  A�A 4A
j!#  6#A�6  A� 4"AF A	Fr@#A�6A�5#  6#    6" 6#  6  0" b@#A�6#  6A�  %! #  6  5 # �!#!# <"6## <"6# <" 6#A�6# 6A�A #A�6# 6A�A #A�6#  6A�A  #A�6#A�6 A�+" 6 #  6  '#  6  7! #A$j$  �#A$k$$#A A$� #  ." 6 # ."6#!#  6# 6#A�(6#  6A�(A  #A�(6# 6A�(A #A�(6#A�6 A�(+" 6#  6#A�)6#  6 A�)A  #A�)6#A�6 A�)+!# 6 '#  6  7! #A$j$  o#Ak$$#A 6 @  E@A�	! A   k    AvAt""!# At jA" 6    j   @  A-; #Aj$  �#Ak$$#A 6   " j!  K@A A�A�A  # AtA" 6   !@  I@@ -  ! Aj! A�q@  F -  A?q! Aj! A�qA�F@  AqAt r;   F -  A?q! Aj! A�qA�F@ AqAt Atr r!  F -  A?q AqAt Atr Atrr! Aj! A��I@  ;   A��k"A
vA��r A�qA��rAtr6  Aj!  ;  Aj!@   k"  Ak"( A|qAkM@  6  ("    ("    K�
   ! #Aj$  �#Ak$$#A 6 @  D        a@A�!    �D        b@    b@A�!A�A�   D        c!  At!# A"6  A�  �
  #Aj$  #Ak$$# 6    2#Aj$�d A�| A�k   d   t o S t r i n g ( )   r a d i x   a r g u m e n t   m u s t   b e   b e t w e e n   2   a n d   3 6 A�	< A�	-   &   ~ l i b / u t i l / n u m b e r . t s A�	 A�		      0 A�	< A�	/   (   A l l o c a t i o n   t o o   l a r g e A�
< A�
'       ~ l i b / r t / i t c m s . t s A�< A�+   $   I n d e x   o u t   o f   r a n g e A�, A�      ~ l i b / r t . t s A�< A�%      ~ l i b / r t / t l s f . t s A�\ A�O   H   0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o p q r s t u v w x y z A�\ A�I   B   G e t t i n g   s t r i n g   l e n g t h   a t   a d d r e s s   A� A� A�< A�+   $   U n p a i r e d   s u r r o g a t e A�, A�#      ~ l i b / s t r i n g . t s A�, A�      S t r i n g   a t   A�, A�        h a s   l e n g t h   A�,                �       A�, A�#      I n v a l i d   l e n g t h A�< A�-   &   ~ l i b / a r r a y b u f f e r . t s A�< A�+   $   ~ l i b / t y p e d a r r a y . t s A�\ A�I   B   E x e c u t i n g   c r e d i t   l e g   f o r   a m o u n t :   A�, A�      ,   a c c o u n t :   A�,                 	      �	 A���?      $@      Y@     @�@     ��@     j�@    ��.A    �cA    �חA    e��A    _�B   �vH7B   ��mB  @�0�B  �ļ�B  4&�kC ��7y�AC �؅W4vC �Ngm��C =�`�X�C@��x�DP����KD��M���D A�� A��   �   
         P R E F I X   e x :   < h t t p : / / e x a m p l e . o r g / > 
         S E L E C T   ? b a l a n c e 
         W H E R E   { 
             e x : A�\ A�K   D     e x : h a s B a l a n c e   ? b a l a n c e   . 
         } 
     A�                �
      ` A�l A�W   P   A t t e m p t i n g   t o   a l l o c a t e   s t r i n g   o f   l e n g t h   A�\ A�E   >   A l l o c a t e d   b u f f e r   f o r   s t r i n g   a t   A�, A�!        w i t h   l e n g t h   A�,                P      � A�L A�;   4   P r o c e s s i n g   c r e d i t   r e s u l t :   A�, A�      " b a l a n c e " : A� A�	      } A�l A�Y   R   I n v a l i d   r e s u l t   f o r m a t   o r   n o   b a l a n c e   f o u n d A�, A�      E r r o r :   A�L A�5   .   I n v a l i d   b a l a n c e   v a l u e :   A�< A�)   "   C u r r e n t   b a l a n c e :   A�< A�+   $   .   A f t e r   c r e d i t   o f   A�< A�%      ,   n e w   b a l a n c e :   A�&,                �      �        A� A�      0 . 0 A� A�      N a N A�, A�      - I n f i n i t y A�, A�      I n f i n i t y A� ���Տ�v�>�ᮺv�U0 ���5�]J�B�-;eU��k��E=���ƚ��p�Oܼ���w��kA�V�<���Ѝ��U1(\Qӵɦ���q�ˋ�#w"��mSx@�I̮Wζ]y<�7V�M6��O�H8oꖐ�:�%˅t������φ��*�
45*�g8�;?����Ȅ���'D�Ŗ�%�Οk���b}$l����_Xf��&��ޓ����������J|l_b�S0�4`���U&����N��~)p$w�ߏ�帟�ߦ�}t��_��ϛ���pD�k�����11eU%�ͬ{���?�;+*�\�Ӓsi�$$�� �����d�̈Po	̼�,e�X��      @�    ���  b���x��	��x9?���{Η�p\�{�2~�h�髤8��E"�&'O�'���1�c���Ȍ8eް�e��ǃ�qB�]�X��,iM��pd��Jw�m��k}�{x	�w�y��T��ś[��[�=]���S5ȳ���\�*��_����F�%�9�4�\���r���ξ�TS�ܷ�A"�����x\ӛ� ��S!{�Z�:0�ܵ�△�\S�٨<D���|��D��LLv��@��,�W���)1����������)�;b� (��ϧz^KD�-ݬ@�!���D^/�g�A����3ԩ㴒���wߺn���k��;�� A�&�<�W�r������������,�F�a�{��������� ��5�P�k�����������
�%�?�Z�t������������.�I�c�~���������  8 S m � � � � � 'B\w�����1Lf����� ;Up�����* A�'(   
   d   �  '  �� @B ���  �� ʚ; A�', A�'      D e b i t i n g   A�(, A�(#        f r o m   a c c o u n t   A�(,                       0 A�(< A�)+   $   C r e a t e d   m e s s a g e :   " A�) A�)	      " A�)                �      � A�)< A�*1   *   O b j e c t   a l r e a d y   p i n n e d A�*< A�*/   (   O b j e c t   i s   n o t   p i n n e d A�+                   A  A $sourceMappingURL./release.wasm.map